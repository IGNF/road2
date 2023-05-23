# Branch and version management

This document explains the procedure to follow to keep branches and versions up to date in Road2, and in the various associated projects.

## Presentation

By its nature, the Road2 project has a `package.json` that contains a version. However, this project does not work alone. There are projects that complement it by having different roles:
- Route Graph Generator allows to generate data usable by Road2
- PGRouting Procedures allows to have the procedures used in BDD by Road2 if the PGRouting engine is used.

Route Graph Generator and PGRouting Procedures are independent as GIT projects. However, they can be pulled in the Road2 project by GIT submodules (`git submodule update --init` at the root of the Road2 project).

## Branches

On these three projects have a `master` and `develop` branch. The first allows you to manage the versions put into production. The second makes it possible to carry out the developments.

We will make sure to start from `develop` and create a branch of the `feature-*` type to create new features.

## Versions and tags

It is assumed that versions are managed on the `master` and `develop` branches of the various projects. And it is for these branches that we will explain how to maintain versions and tags.

### General

Each project will have, on the `develop` branch, a higher version than the one present on `master`; as well as the mention `-DEVELOP`.

For example, we will make sure to always have, for each project, a state similar to the following:
- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

We will make sure to tag the commits of each project with the right versions. And this on the `master` branch mostly. This is useful for two reasons:
- We must be able to identify, by the tags, the versions of the code used in production.
- We must be able to make all the projects work together from the tags on `master` and `develop`.

### PGRouting Procedures and Route Graph Generator

It is advisable to start by managing the versions of these two. *The following describes the process for updating projects, but without going through the GIT* submodules. If you want to use submodules, you can refer to the documentation [proposed by GIT](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

Initial state for each project:

- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

Steps to follow for each project:

1. Test `develop` and correct if necessary.
2. Update version on `master` to 1.0.1.
3. Merge of `develop` on `master`.
4. Update version on `develop` to 1.0.2-DEVELOP.
5. Run tests on `master` and correct if necessary.
6. If there were fixes on `master`, then merge `master` on `develop` and start over at 1. changing the version number.

### Road2

Road2 depends on the other two. This leads to subtleties.

Initial state for each project:

- `master` branch: 1.0.0
- `develop` branch: 1.0.1-DEVELOP

Procedure for Road2:

0. Perform version upgrades and merges on Route Graph Generator and PGRouting Procedures.
1. Test `develop` with the `develop` of other projects, and correct if necessary.
2. Update version on `develop` to 1.0.1.
3. Merge of `develop` on `master`.
4. Update version on `develop` to 1.0.2-DEVELOP.
5. Do tests on `master` with the `master` of other projects, and correct if necessary.
6. If there were fixes on `master`, then merge `master` on `develop` and start over at 1. changing the version number.
7. If there were no corrections on `master`, and we have the `master` and the `develop` of the three projects that work together, then tag `master` and `develop` with the versions, on each project.

### Submodule management

Currently, Road2 uses PGRouting Procedures and Route Graph Generator to build the various docker images that allow testing and developing the service. The version used in Road2 on its `master` and `develop` branch is *a specific commit* of the `master` of each submodule.

To point to a more recent commit, we will follow the following procedure:
- go to the `develop` branch of Road2
- at the root of the project, run the command `git submodule update --remote`
- make the commit of this reference change
- merge `develop` on `master`