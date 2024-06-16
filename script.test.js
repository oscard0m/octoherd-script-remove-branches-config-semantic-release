import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { Octokit } from "@octoherd/cli";
import { script } from "./script.js";
import { repository } from "./tests/fixtures/respository-example.js";
import nock from "nock";

const getOctokitForTests = () => {
  return new Octokit({
    retry: { enabled: false },
    throttle: { enabled: false },
  });
};

before(() => {
  nock.disableNetConnect();
});

beforeEach(() => {
  nock.cleanAll();
});

after(() => {
  nock.restore();
});

test("removes 'release.branches' entry to package.json if it existed", async () => {
  const expectedPackageJson = {
    name: "octoherd-cli",
    version: "0.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: "",
    license: "ISC",
    release: {
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/github",
        [
          "@semantic-release/npm",
          {
            pkgRoot: "./pkg",
          },
        ],
        [
          "semantic-release-plugin-update-version-in-files",
          {
            files: ["pkg/dist-web/*", "pkg/dist-node/*", "pkg/*/version.*"],
          },
        ],
      ],
    },
  };
  const originalPackageJson = {
    ...expectedPackageJson,
    release: {
      branches: [
        "+([0-9]).x",
        "main",
        "next",
        {
          name: "beta",
          prerelease: true,
        },
        {
          name: "debug",
          prerelease: true,
        },
      ],
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/github",
        [
          "@semantic-release/npm",
          {
            pkgRoot: "./pkg",
          },
        ],
        [
          "semantic-release-plugin-update-version-in-files",
          {
            files: ["pkg/dist-web/*", "pkg/dist-node/*", "pkg/*/version.*"],
          },
        ],
      ],
    },
  };

  nock("https://api.github.com")
    .get(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`
    )
    .reply(200, {
      type: "file",
      sha: "randomSha",
      content: Buffer.from(JSON.stringify(originalPackageJson)).toString(
        "base64"
      ),
    })
    .put(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`,
      (body) => {
        const pkg = JSON.parse(Buffer.from(body.content, "base64").toString());

        assert.deepEqual(pkg, expectedPackageJson);

        return true;
      }
    )
    .reply(200, { commit: { html_url: "link to commit" } });

  await script(getOctokitForTests(), repository);
});

test("removes 'release.branches' and 'release' entry to package.json if the entry becomes empty", async () => {
  const expectedPackageJson = {
    name: "octoherd-cli",
    version: "0.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: "",
    license: "ISC",
  };
  const originalPackageJson = {
    ...expectedPackageJson,
    release: {
      branches: [
        "+([0-9]).x",
        "main",
        "next",
        {
          name: "beta",
          prerelease: true,
        },
        {
          name: "debug",
          prerelease: true,
        },
      ],
    },
  };

  nock("https://api.github.com")
    .get(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`
    )
    .reply(200, {
      type: "file",
      sha: "randomSha",
      content: Buffer.from(JSON.stringify(originalPackageJson)).toString(
        "base64"
      ),
    })
    .put(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`,
      (body) => {
        const pkg = JSON.parse(Buffer.from(body.content, "base64").toString());

        assert.deepEqual(pkg, expectedPackageJson);

        return true;
      }
    )
    .reply(200, { commit: { html_url: "link to commit" } });

  await script(getOctokitForTests(), repository);
});

test("preserves spacing for JSON files", async () => {
  const path = "package.json";

  const originalPackageJson = {
    name: "octoherd-cli",
    version: "0.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: "",
    license: "ISC",
    release: {
      branches: [
        "+([0-9]).x",
        "main",
        "next",
        {
          name: "beta",
          prerelease: true,
        },
        {
          name: "debug",
          prerelease: true,
        },
      ],
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/github",
        [
          "@semantic-release/npm",
          {
            pkgRoot: "./pkg",
          },
        ],
        [
          "semantic-release-plugin-update-version-in-files",
          {
            files: ["pkg/dist-web/*", "pkg/dist-node/*", "pkg/*/version.*"],
          },
        ],
      ],
    },
  };

  nock("https://api.github.com")
    .get(`/repos/${repository.owner.login}/${repository.name}/contents/${path}`)
    .reply(200, {
      type: "file",
      sha: "randomSha",
      content: Buffer.from(JSON.stringify(originalPackageJson)).toString(
        "base64"
      ),
    })
    .put(
      `/repos/${repository.owner.login}/${repository.name}/contents/${path}`,
      (body) => {
        assert.deepEqual(
          Buffer.from(body.content, "base64").toString(),
          "{\n" +
            '  "name": "octoherd-cli",\n' +
            '  "version": "0.0.0",\n' +
            '  "description": "",\n' +
            '  "main": "index.js",\n' +
            '  "scripts": {\n' +
            '    "test": "echo \\"Error: no test specified\\" && exit 1"\n' +
            "  },\n" +
            '  "author": "",\n' +
            '  "license": "ISC",\n' +
            '  "release": {\n' +
            '    "plugins": [\n' +
            '      "@semantic-release/commit-analyzer",\n' +
            '      "@semantic-release/release-notes-generator",\n' +
            '      "@semantic-release/github",\n' +
            "      [\n" +
            '        "@semantic-release/npm",\n' +
            "        {\n" +
            '          "pkgRoot": "./pkg"\n' +
            "        }\n" +
            "      ],\n" +
            "      [\n" +
            '        "semantic-release-plugin-update-version-in-files",\n' +
            "        {\n" +
            '          "files": [\n' +
            '            "pkg/dist-web/*",\n' +
            '            "pkg/dist-node/*",\n' +
            '            "pkg/*/version.*"\n' +
            "          ]\n" +
            "        }\n" +
            "      ]\n" +
            "    ]\n" +
            "  }\n" +
            "}\n"
        );

        return true;
      }
    )
    .reply(200, { commit: { html_url: "link to commit" } });

  await script(getOctokitForTests(), repository);
});

test("returns if 'release.branches' entry is not present in 'package.json'", async () => {
  const originalPackageJson = {
    name: "octoherd-cli",
    version: "0.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: "",
    license: "ISC",
  };

  nock("https://api.github.com")
    .get(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`
    )
    .reply(200, {
      type: "file",
      sha: "randomSha",
      content: Buffer.from(JSON.stringify(originalPackageJson)).toString(
        "base64"
      ),
    })
    .put(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`,
      () => {
        assert.fail("this request should not happen");

        return true;
      }
    )
    .reply(200, { commit: { html_url: "link to commit" } });

  await script(getOctokitForTests(), repository);
});

test("throws if JSON file provided is NOT a file", async () => {
  nock("https://api.github.com")
    .get(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`
    )
    .reply(200, {
      sha: "randomSha",
      type: "dir",
    });

  try {
    await script(getOctokitForTests(), repository);
    assert.fail("should have thrown");
  } catch (error) {
    assert.deepEqual(
      error.message,
      "[@octokit/plugin-create-or-update-text-file] https://api.github.com/repos/octocat/Hello-World/contents/package.json is not a file, but a dir"
    );
  }
});

test("throws if server fails when retrieving the JSON file", async () => {
  nock("https://api.github.com")
    .get(
      `/repos/${repository.owner.login}/${repository.name}/contents/package.json`
    )
    .reply(500);

  try {
    await script(getOctokitForTests(), repository);
    assert.fail("should have thrown");
  } catch (error) {
    assert.deepEqual(error.status, 500);
    assert.deepEqual(error.name, "HttpError");
  }
});

test("throws if repository.owner is NOT provided", async () => {
  const repoWithoutOwner = { ...repository, owner: null };

  try {
    await script(getOctokitForTests(), repoWithoutOwner);
    assert.fail("should have thrown");
  } catch (error) {
    assert.deepEqual(
      error.message,
      "repository must have an 'owner' associated"
    );
  }

  assert.deepEqual(nock.pendingMocks().length, 0);
});

test("returns if repository is archived", async () => {
  const respositoryArchived = { ...repository, archived: true };

  try {
    await script(getOctokitForTests(), respositoryArchived);
  } catch (error) {
    assert.fail("should have NOT thrown");
  }

  assert.deepEqual(nock.pendingMocks().length, 0);
});
