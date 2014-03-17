/**
 * @author wbenkraiem
 */
Ext.define("NotesApp.controller.Notes", {

	extend : "Ext.app.Controller",
	config : {
		refs : {
			// We're going to lookup our views by xtype.
			notesListContainer : "noteslistcontainer",
			noteEditor : "noteeditor"
		},
		control : {
			notesListContainer : {
				// The commands fired by the notes list container.
				newNoteCommand : "onNewNoteCommand",
				editNoteCommand : "onEditNoteCommand"
			},
			noteEditor : {
				// The commands fired by the note editor.
				saveNoteCommand : "onSaveNoteCommand",
				deleteNoteCommand : "onDeleteNoteCommand",
				backToHomeCommand : "onBackToHomeCommand"

			}
		}
	},
	slideLeftTransition : {
		type : 'slide',
		direction : 'left'
	},

	slideRightTransition : {
		type : 'slide',
		direction : 'right'
	},

	// Commands.
	onNewNoteCommand : function() {

		// // console.log("onNewNoteCommand");

		var now = new Date();
		var noteId = (now.getTime()).toString() + (this.getRandomInt(0, 100)).toString();

		var newNote = Ext.create("NotesApp.model.Note", {
			id : noteId,
			dateCreated : now,
			title : "",
			narrative : ""
		});

		this.activateNoteEditor(newNote);
	},

	getRandomInt : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	activateNoteEditor : function(record) {

		var noteEditor = this.getNoteEditor();
		noteEditor.setRecord(record);
		// load() is deprecated.
		Ext.Viewport.animateActiveItem(noteEditor, this.slideLeftTransition);

	},

	activateNotesList : function() {
		Ext.Viewport.animateActiveItem(this.getNotesListContainer(), this.slideRightTransition);
	},

	onEditNoteCommand : function(list, record) {
		this.activateNoteEditor(record);
		// // console.log("onEditNoteCommand");
	},

	onSaveNoteCommand : function() {

		// // console.log("onSaveNoteCommand");

		var noteEditor = this.getNoteEditor();

		var currentNote = noteEditor.getRecord();
		var newValues = noteEditor.getValues();

		// Update the current note's fields with form values.
		currentNote.set("title", newValues.title);
		currentNote.set("narrative", newValues.narrative);

		var errors = currentNote.validate();

		if (!errors.isValid()) {
			Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
			currentNote.reject();
			return;
		}

		var notesStore = Ext.getStore("Notes");

		if (null == notesStore.findRecord('id', currentNote.data.id)) {
			notesStore.add(currentNote);
		}

		notesStore.sync();

		notesStore.sort([{
			property : 'dateCreated',
			direction : 'DESC'
		}]);

		this.activateNotesList();
	},

	onDeleteNoteCommand : function() {

		Ext.Msg.confirm("Delete note?", "Do you reall want to delete the note ?", function(buttonId) {
			if (buttonId === 'yes') {
				// console.log("onDeleteNoteCommand");

				var noteEditor = this.getNoteEditor();
				var currentNote = noteEditor.getRecord();
				var notesStore = Ext.getStore("Notes");

				notesStore.remove(currentNote);
				notesStore.sync();
				this.activateNotesList();
			}
		}, this // scope of the controller
		);
	},
	onBackToHomeCommand : function() {

		// // console.log("onBackToHomeCommand");
		this.activateNotesList();
	},

	//methode pour le butom new note
	onNewNote : function() {
		// // console.log("onNewNote");
	},

	// methode  launch et initialisation
	//methode launch sera appeler apres le chargement de view : interface et apres le chargement de launch de app.js
	launch : function() {
		this.callParent(arguments);
		Ext.getStore("Notes").load();
		// // console.log("launch controler");
	},
	//methode init sera appeler avans le chargement de view : interface
	init : function() {
		this.callParent(arguments);
		// // console.log("init Controler");
	}
});
