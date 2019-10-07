import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class road2LoadTest extends Simulation {

    val urls = ssv("./resources/road2_parameters.ssv").shuffle.circular

    val httpConf = http.baseUrl("http://road2-centos:8080/simple/1.0.0/route?").disableCaching

    val scn = scenario("road2")
    .feed(urls).repeat(1){
        exec(
        http("compute").get("resource=${resource}&profile=${profile}&optimization=${optimization}&start=${start}&end=${end}&intermediates=${intermediates}&geometryFormat=${geometryFormat}&getSteps=${getSteps}&getBbox=${getBbox}")
        )
    }

    setUp(
    scn.inject(
        nothingFor(5 seconds),
        rampUsersPerSec (0) to (10) during (60 seconds),
        constantUsersPerSec(10) during (60 seconds) randomized
    ).protocols(httpConf))

}