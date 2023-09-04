DEV_TARGET ?= test
FORGE_TEST = FOUNDRY_PROFILE=test forge test

dev:
	nodemon -e sol -x sh -- -c "make $(DEV_TARGET) || exit 1"

test:
	$(FORGE_TEST) $(TEST_OPTS)

.PHONY: dev test
