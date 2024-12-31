# Branch and version management

This document explains the procedure to follow to keep branches and versions up to date in Road2, and in the various associated projects.

## Presentation

By its nature, the Road2 project has a `package.json` that contains a version. However, this project does not work alone. There are projects that complement it by having different roles:
- Route Graph Generator allows to generate data usable by Road2
- PGRouting Procedures allows to have the procedures used in BDD by Road2 if the PGRouting engine is used.

Route Graph Generator and PGRouting Procedures are independent as GIT projects. However, they can be pulled in the Road2 project by GIT submodules (`git submodule update --init` at the root of the Road2 project).

## Branches

These three projects have a `main` branch. The production versions are managed via releases created from tags made on this branch.

We will make sure to start from `main` and create a branch like this:
- `doc/*` to modify or add documentation only,
- `feat/*` to create new features,
- `fix/*` to make a correction to the source code,
- `docker/*` to modify the docker part only,
- `test/*` to modify only the tests,
- `ci/*` to modify the Github CI

To merge a branch with `main`, we will make sure to have done a rebase of develop on this branch. And on the merge method, we will do a squash. So, the `main` branch will have one commit per feature, fix, etc...


## Versions and tags

It is assumed that versions are managed on the `main` branch of the various projects. And it is for this branch that we will explain how to maintain versions and tags.

### General

Each project will have, on the `main` branch, a higher version than the last release version; as well as the mention `-BETA`.

For example, we will make sure to always have, for each project, a state similar to the following:
- last release: 1.0.0
- `main` branch: 1.0.1-BETA

We will make sure to tag the commits of each project with the right versions. This is useful for two reasons:
- We must be able to identify, by the tags, the versions of the code used in production.
- We must be able to make all the projects work together from the tags on `main`.

### PGRouting Procedures and Route Graph Generator

It is advisable to start by managing the versions of these two. *The following describes the process for updating projects, but without going through the GIT* submodules. If you want to use submodules, you can refer to the documentation [proposed by GIT](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

Initial state for each project:

- last release: 1.0.0
- `main` branch: 1.0.1-BETA

Steps to follow for each project:

1. Test `main` and correct if necessary.
2. Update version on `main` to 1.0.1.
3. Create tag 1.0.1
4. Update version on `main` to 1.0.2-BETA.
5. Run tests on 1.0.1 and correct if necessary.
6. If there were fixes, start over at 1. changing the version number. Else, publish a release from the 1.0.1 tag.

### Road2

Road2 depends on the other two. This leads to subtleties.

Initial state for each project:

- last release: 1.0.0
- `main` branch: 1.0.1-BETA

Procedure for Road2:

0. Perform version upgrades and merges on Route Graph Generator and PGRouting Procedures.
1. Test `main` with the `main` of other projects, and correct if necessary.
2. Update version on `main` to 1.0.1.
3. Create tag 1.0.1
4. Update version on `main` to 1.0.2-BETA.
5. Run tests on 1.0.1 and correct if necessary.
6. If there were fixes, start over at 1. changing the version number. Else, publish a release from the 1.0.1 tag.

### Submodule management

Currently, Road2 uses PGRouting Procedures and Route Graph Generator to build the various docker images that allow testing and developing the service. The version used in Road2 on its `main` branch is *a specific commit* of the `main` of each submodule.

To point to a more recent commit, we will follow the following procedure:
- create a branch from the `main` branch of Road2
- at the root of the project, run the command `git submodule update --remote`
- make the commit of this reference change
- create a PR for the update on `main`

