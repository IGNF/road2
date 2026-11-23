const assert = require('assert');
const { once } = require('events');
const express = require('express');
const sinon = require('sinon');
const controller = require('../../../../src/js/apis/simple/1.0.0/controller/controller');
const router = require('../../../../src/js/apis/simple/1.0.0');
const { RETURN_GEOMETRY_PARAMETER } = require('../../../../src/js/apis/simple/1.0.0/routeResponseOptions');
const Distance = require('../../../../src/js/geography/distance');
const Duration = require('../../../../src/js/time/duration');
const Line = require('../../../../src/js/geometry/line');
const Point = require('../../../../src/js/geometry/point');

const routeRequest = {
  geometryFormat: 'geojson',
  computeSteps: true,
  bbox: true,
  distanceUnit: 'kilometer',
  timeUnit: 'hour',
  constraints: [{ type: 'banned', key: 'name', operator: '=', value: 'A' }]
};

function makeRouteResponse() {
  const crs = 'EPSG:2154';
  const start = new Point(650000, 6860000, crs);
  const middle = new Point(651000, 6860000, crs);
  const end = new Point(652000, 6860000, crs);
  const line = (...points) => new Line({
    type: 'LineString',
    coordinates: points.map(point => [point.x, point.y])
  }, 'geojson', crs);

  function makePortion(start, end) {
    return {
      start,
      end,
      distance: new Distance(1000, 'meter'),
      duration: new Duration(900, 'second'),
      steps: [{
        geometry: line(start, end),
        distance: new Distance(1000, 'meter'),
        duration: new Duration(900, 'second')
      }]
    };
  }

  return {
    start,
    end,
    resource: 'test',
    profile: 'car',
    optimization: 'fastest',
    routes: [{
      geometry: line(start, middle, end),
      distance: new Distance(2000, 'meter'),
      duration: new Duration(1800, 'second'),
      portions: [makePortion(start, middle), makePortion(middle, end)]
    }]
  };
}

describe('Simple API controller', function() {

  describe('convertPostArrayToGetParameters', function() {

    it('rejects scalar values for exploded array parameters', function() {
      assert.throws(function() {
        controller.convertPostArrayToGetParameters('not-an-array', { explode: 'true' }, 'intermediates');
      }, function(error) {
        return error.status === 400;
      });
    });

    it('serializes each array value according to its own type', function() {
      const parameter = { explode: 'false', style: 'pipeDelimited' };
      const values = [1, { id: 2 }, null];

      assert.strictEqual(
        controller.convertPostArrayToGetParameters(values, parameter, 'constraints'),
        '1|{"id":2}|null'
      );
    });

    describe('route metadata response', function() {
      const service = { getResourceById: () => ({ version: '1' }) };

      it('returns only route metadata without accessing the geometry or portions', function() {
        const response = makeRouteResponse();
        for (const property of ['geometry', 'portions']) {
          Object.defineProperty(response.routes[0], property, {
            get() { assert.fail(`Unexpected access to ${property}`); }
          });
        }

        assert.deepStrictEqual(controller.writeRouteResponse(routeRequest, response, service, false), {
          resource: 'test',
          resourceVersion: '1',
          start: '650000,6860000',
          end: '652000,6860000',
          profile: 'car',
          optimization: 'fastest',
          distance: 2,
          distanceUnit: 'kilometer',
          duration: 0.5,
          timeUnit: 'hour',
          constraints: routeRequest.constraints
        });
      });

      it('returns an empty constraints array when no constraints were requested', function() {
        const response = controller.writeRouteResponse(
          { ...routeRequest, constraints: [] }, makeRouteResponse(), service, false
        );
        assert.deepStrictEqual(response.constraints, []);
      });

      for (const method of ['GET', 'POST']) {
        it(`honors the option on ${method} and rejects invalid values before calculation`, async function() {
          const app = express();
          const computeRequest = sinon.stub().callsFake(makeRouteResponse);
          app.set('service', { ...service, verifyAvailabilityOperation: () => true, computeRequest });
          app.use('/simple/1.0.0', router);
          const checkParameters = sinon.stub(controller, 'checkRouteParameters').returns(routeRequest);
          const server = app.listen(0, '127.0.0.1');

          try {
            await once(server, 'listening');
            const route = process.env.ROUTE_ROUTE || 'route';
            const url = `http://127.0.0.1:${server.address().port}/simple/1.0.0/${route}`;
            const send = (values = []) => method === 'GET'
              ? fetch(`${url}?${new URLSearchParams(values.map(value => [RETURN_GEOMETRY_PARAMETER, value]))}`)
              : fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values.length ? { [RETURN_GEOMETRY_PARAMETER]: values[0] } : {})
              });

            const full = await send();
            assert.strictEqual(full.status, 200);
            const fullBody = await full.json();
            assert.ok(fullBody.geometry);
            assert.ok(fullBody.bbox);
            assert.strictEqual(fullBody.portions.length, 2);
            assert.ok(fullBody.portions[0].steps[0].geometry);
            assert.deepStrictEqual(await (await send([true])).json(), fullBody);

            const metadata = await send([false]);
            assert.strictEqual(metadata.status, 200);
            const { geometry, bbox, portions, crs, ...expectedMetadata } = fullBody;
            assert.deepStrictEqual(await metadata.json(), expectedMetadata);
            sinon.assert.alwaysCalledWithExactly(computeRequest, routeRequest);

            const invalidValues = method === 'GET'
              ? [[''], ['1'], ['true', 'false']]
              : [['true'], [null], [1], [[true]]];
            for (const values of invalidValues) {
              const invalid = await send(values);
              assert.strictEqual(invalid.status, 400);
              assert.ok((await invalid.json()).error.message.includes(RETURN_GEOMETRY_PARAMETER));
            }
            sinon.assert.callCount(computeRequest, 3);
          } finally {
            checkParameters.restore();
            await new Promise(resolve => server.close(resolve));
          }
        });
      }
    });

  });

});
