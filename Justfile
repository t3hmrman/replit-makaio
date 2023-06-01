watchexec := env_var_or_default("WATCHEXEC", "watchexec")
pnpm := env_var_or_default("PNPM", "pnpm")
vite := env_var_or_default("VITE", "vite")
just := env_var_or_default("JUST", "just")
git := env_var_or_default("GIT", "git")
node := env_var_or_default("NODE", "node")
devcontainer := env_var_or_default("DEVCONTAINER", "devcontainer")

root_dir := invocation_directory()

version := `node -e 'console.log("v" + require("./package.json").version);'`
sha := `git rev-parse --short HEAD`

in_ci := env_var_or_default("CI", "no")

default:
    @{{just_executable()}} --list

###############
# Development #
###############

# Set up the project
setup:
    @{{pnpm}} install

# Lint the project
lint:
    @{{pnpm}} lint

# Lint the project (continously)
lint-watch:
    @{{pnpm}} run-watch lint

# Format the project
fmt:
    @{{pnpm}} format

# Build the project
build:
    @{{pnpm}} build

# Build the project (continuously)
build-watch:
    {{just_executable()}} run-watch build

# Enter the development loop
devloop:
    {{pnpm}} dev

# Start the dev container
devcontainer:
    {{devcontainer}} --workspace-folder {{root_dir}} up --remove-existing-container

###########
# Tooling #
###########

## This is determined by jsconfig.json
build_output_folder := env_var_or_default("BUILD_OUTPUT_FOLDER", "./dist")

# Print the current version
print-version:
    @echo -n "{{version}}"

# Print the current SHA
print-sha:
    @echo -n "{{sha}}"

# Serve the project and run some just command repeatedly
run-watch target:
    @{{watchexec}} \
    --ignore=node_modules,{{build_output_folder}} \
    --exts=html,js,ts,svelte \
    --watch=src \
    --watch=test \
    --restart \
    {{just}} {{target}}

###########
# Testing #
###########

# Run all tests
test: test-unit test-int test-e2e

# Run the unit tests
test-unit:
    @{{pnpm}} test-unit

# Run the int tests
test-int:
    @{{pnpm}} test-int

# Run the e2e tests
test-e2e:
    @{{pnpm}} test-e2e

# Run the e2e tests with the UI attached
test-e2e-ui:
    @{{pnpm}} test-e2e-ui
