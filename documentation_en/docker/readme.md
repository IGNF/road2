# Use Road2 with Docker

This folder gathers the different files allowing to use Road2 with docker.

There is a sub-folder for the major use cases identified:
- [dev](./dev/readme.md): develop Road2
- [demonstration](./demonstration/readme.md): obtain a local demonstration of the services offered by Road2. This Dockerfile is limited to OSRM and PGRouting engine testing as there are no Valhalla bindings at this time.
- [test](./test/readme.md): Test Road2

Other subfolders are ordered as follows for convenience:
- [web](./web/readme.md): This folder gathers useful files to have a small website which contains several documentations and graphic test pages for Road2.
- {{ '[config]({}/tree/{}/docker/config/)'.format(repo_url, repo_branch) }}: This folder contains several configuration files that are common to the other subfolders.
- [distributions](./distributions/readme.md): This folder can group different `Dockerfile` which are examples of installation under different distributions. Currently there is only one example left for Debian. This is the Dockerfile recommended for development on Road2 because it contains all the binaries useful for the different engines.