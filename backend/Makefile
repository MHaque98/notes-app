# Makefile for building Lambda functions with shared code

.PHONY: build-CreateNoteFunction build-GetNoteFunction build-ListNotesFunction build-UpdateNoteFunction build-DeleteNoteFunction

# Build function: copies function code, shared code, and installs dependencies
build-CreateNoteFunction:
	@echo "Building CreateNoteFunction"
	@mkdir -p $(ARTIFACTS_DIR)/functions/createNote
	@cp -r functions/createNote/* $(ARTIFACTS_DIR)/functions/createNote/
	@mkdir -p $(ARTIFACTS_DIR)/shared
	@cp -r shared/* $(ARTIFACTS_DIR)/shared/
	@cp functions/createNote/package.json $(ARTIFACTS_DIR)/
	@cd $(ARTIFACTS_DIR) && npm install --production

build-GetNoteFunction:
	@echo "Building GetNoteFunction"
	@mkdir -p $(ARTIFACTS_DIR)/functions/getNote
	@cp -r functions/getNote/* $(ARTIFACTS_DIR)/functions/getNote/
	@mkdir -p $(ARTIFACTS_DIR)/shared
	@cp -r shared/* $(ARTIFACTS_DIR)/shared/
	@cp functions/getNote/package.json $(ARTIFACTS_DIR)/
	@cd $(ARTIFACTS_DIR) && npm install --production

build-ListNotesFunction:
	@echo "Building ListNotesFunction"
	@mkdir -p $(ARTIFACTS_DIR)/functions/listNotes
	@cp -r functions/listNotes/* $(ARTIFACTS_DIR)/functions/listNotes/
	@mkdir -p $(ARTIFACTS_DIR)/shared
	@cp -r shared/* $(ARTIFACTS_DIR)/shared/
	@cp functions/listNotes/package.json $(ARTIFACTS_DIR)/
	@cd $(ARTIFACTS_DIR) && npm install --production

build-UpdateNoteFunction:
	@echo "Building UpdateNoteFunction"
	@mkdir -p $(ARTIFACTS_DIR)/functions/updateNote
	@cp -r functions/updateNote/* $(ARTIFACTS_DIR)/functions/updateNote/
	@mkdir -p $(ARTIFACTS_DIR)/shared
	@cp -r shared/* $(ARTIFACTS_DIR)/shared/
	@cp functions/updateNote/package.json $(ARTIFACTS_DIR)/
	@cd $(ARTIFACTS_DIR) && npm install --production

build-DeleteNoteFunction:
	@echo "Building DeleteNoteFunction"
	@mkdir -p $(ARTIFACTS_DIR)/functions/deleteNote
	@cp -r functions/deleteNote/* $(ARTIFACTS_DIR)/functions/deleteNote/
	@mkdir -p $(ARTIFACTS_DIR)/shared
	@cp -r shared/* $(ARTIFACTS_DIR)/shared/
	@cp functions/deleteNote/package.json $(ARTIFACTS_DIR)/
	@cd $(ARTIFACTS_DIR) && npm install --production

