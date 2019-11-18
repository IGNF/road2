import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class road2IsoLoadTest extends Simulation {

    val urls = ssv("./resources/road2_parameters_iso.ssv").shuffle.circular

    val httpConf = http.baseUrl("http://road2-centos:8080/simple/1.0.0/isochrone?").disableCaching

    val scn = scenario("road2")
    .feed(urls).repeat(1){
        exec(
        http("compute").get("resource=${resource}&profile=${profile}&costType=${costType}&point=${point}&costValue=${costValue}&direction=${direction}&geometryFormat=${geometryFormat}")
        )
    }

    setUp(
    scn.inject(
        // nothingFor(5 seconds),
        // rampUsersPerSec (0) to (10) during (60 seconds),
        constantUsersPerSec(1) during (60 seconds) randomized
    ).protocols(httpConf))

}