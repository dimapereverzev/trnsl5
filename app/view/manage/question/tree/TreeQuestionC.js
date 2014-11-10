Ext.define('App.view.manage.question.tree.TreeQuestionC', {
    extend: 'Ext.app.ViewController',
    requires: [],
    alias: 'controller.treeQuestion',

    control: {
        '#': {
            cellclick: function (tree, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                console.log('treeQuestion cellclick');

                var treeQuestion = tree.up('#content').down('treepanel'),
                    gridQuestion = tree.up('#content').down('gridQuestion'),
                    storeQuestion = gridQuestion.store,
                    selection = treeQuestion.getSelected(),
                    gridAnswer = tree.up('#content').down('gridAnswer'),
                    storeAnswer = gridAnswer.store;

                storeAnswer.filter(function () {
                    return false
                });

                if (selection) { // * без этого ругается, когда на + нажимаешь
                    if (selection.raw) { // * что-то выбрали
                        var knowid = selection.raw.knowid,
                            groupid = selection.raw.groupid,
                            orgid = selection.raw.orgid,
                            actid = selection.raw.actid,
                            id = selection.raw.id;
                        storeQuestion.clearFilter();
                        storeQuestion.load({
                            params: {
                                id: id,
                                orgid: orgid,
                                actid: actid,
                                knowid: knowid,
                                groupid: groupid
                            }
                        });
                        // * фильтрация вопросов в зависимости от того какой уровень в структуре выбрали
                        /*storeQuestion.filter(function (rec) {
                         if ((rec.get('knowid') == knowid
                         && rec.get('groupid') == groupid) // * ОЗ
                         ||
                         (id == 'root') // * root
                         ||
                         (rec.get('actid') == actid
                         && groupid == undefined
                         && knowid == undefined) // * Вид деятельности
                         ||
                         (rec.get('groupid') == groupid
                         && knowid == undefined)) // * Группа
                         return true;
                         });*/
                    }
                }
            }
        },
        'tool[type=maximize]': {
            click: function (button, e, tree) {
                Utilities.treeCollapse(button, e, tree);
            }
        },
        'dataview': {
            // чтобы не добавлялась запись в tree при драгндропе:
            // сохраняем перемещаемую запись в переменную droppedRecords, очищаем список перемещаемых записей
            beforedrop: function (node, gridRec, overModel, dropPos, opts) {
                /*var layout = this.getTreeQuestion().up('#card-3-manage');
                 layout.body.mask('Идет обработка...');*/
                this.droppedRecords = gridRec.records;
                gridRec.records = [];
            },
            nodedragover: function (targetNode, position, dragData) { // * добавляьб только в ОЗ
                var knowid;
                if (targetNode.raw) {
                    knowid = targetNode.raw.knowid;
                }
                return knowid ? true : false;
            },
            drop: function (node, data, treeRec, dropPosition) {
                Ext.getBody().mask('Идет перемещение...');
                // * отложенный вызов функции, чтобы маска успевала поставиться
                Ext.defer(function () {
                    var treeQuestion = button.up('treepanel'),
                        sel = treeQuestion.getSelected(),
                        gridQuestion = treeQuestion.up('#content').down('gridQuestion'),
                        gridAnswer = treeQuestion.up('#content').down('gridAnswer'),
                        storeAnswer = gridAnswer.store,
                        knowid,
                        groupid;
                    storeAnswer.filter(function () {
                        return false
                    });
                    Ext.iterate(this.droppedRecords, function (record) {
                        var questionid = record.get('questionid'),
                            oldRec = gridQuestion.store.findRecord('questionid', questionid, 0, false, true, true);
                        gridQuestion.store.clearFilter();
                        if (treeRec.raw) {
                            knowid = treeRec.raw.knowid;
                            groupid = treeRec.raw.groupid;
                            oldRec.set('knowid', knowid);
                            oldRec.set('groupid', groupid);
                        }
                    });
                    this.droppedRecords = undefined;
                    gridQuestion.store.sync({
                        success: function () {
                            gridQuestion.store.load({
                                params: {
                                    knowid: knowid,
                                    groupid: groupid
                                }
                            });
                            Ext.getBody().unmask();
                        },
                        failure: function () {
                            Ext.getBody().unmask();
                            App.util.Utilities.errorMessage('Ошибка перемещения', 'Во время перемещения вопросов возникла ошибка');
                        },
                        scope: this
                    });
                    gridQuestion.getSelectionModel().deselectAll();
                    treeQuestion.getSelectionModel().select(treeRec);
                }, 10, this);
            }
        },
        '#refreshTreeQuestionS': {
            click: function (button) {
                console.log('click refreshTreeQuestionS');

                var treeQuestion = button.up('treepanel'),
                    gridAnswer = treeQuestion.up('#content').down('gridAnswer'),
                    storeAnswer = gridAnswer.store,
                    gridQuestion = treeQuestion.up('#content').down('gridQuestion'),
                    storeQuestion = gridQuestion.store;
                storeAnswer.filter(function () {
                    return false
                });
                storeQuestion.filter(function () {
                    return false
                });
                treeQuestion.store.load();
            }
        },
        /*'#expandTreeQuestionS': {
         click: function (button) {
         console.log('click expandTreeQuestionS');

         var treeQuestion = button.up('treepanel');
         treeQuestion.expandAll();
         }
         },
         '#collapseTreeQuestionS': {
         click: function (button) {
         console.log('click collapseTreeQuestionS');

         var treeQuestion = button.up('treepanel');
         treeQuestion.collapseAll();
         }
         }*/

    }
});
