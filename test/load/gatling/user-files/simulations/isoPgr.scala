import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class isoPgr extends Simulation {

    val urls = ssv("./resources/isoPgr.ssv").shuffle.circular

    val httpConf = http.baseUrl("http://road2:8080/simple/1.0.0/isochrone?").disableCaching

    val scn = scenario("road2")
    .feed(urls).repeat(1){
        exec(
        http("compute").get("resource=${resource}&profile=${profile}&costType=${costType}&point=${point}&costValue=${costValue}&direction=${direction}&geometryFormat=${geometryFormat}")
        )
    }

    setUp(
    scn.inject(
        constantUsersPerSec(1) during (60 seconds) randomized
    ).protocols(httpConf))

}