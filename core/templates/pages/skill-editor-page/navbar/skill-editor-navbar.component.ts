// Copyright 2022 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Component for the navbar of the skill editor.
 */

import { Subscription } from 'rxjs';
import { SkillEditorSaveModalComponent } from '../modal-templates/skill-editor-save-modal.component';
import { SavePendingChangesModalComponent } from 'components/save-pending-changes/save-pending-changes-modal.component';
import { Component } from '@angular/core';
import { UndoRedoService } from 'domain/editor/undo_redo/undo-redo.service';

@Component({
  selector: 'oppia-skill-editor-navbar',
  templateUrl: './skill-editor-navbar.component.html'
})
export class SkillEditorNavbarComponent implements OnInit {
  directiveSubscriptions = new Subscription();
  ACTIVE_TAB_EDITOR = 'Editor';
  ACTIVE_TAB_QUESTIONS = 'Questions';
  ACTIVE_TAB_PREVIEW = 'Preview';
  showNavigationOptions;
  activeTab;
  showSkillEditOptions;

  constructor(
    private alertsService: AlertsService,
    private ngbModal: NgbModal,
    private skillEditorRoutingService: SkillEditorRoutingService,
    private skillEditorStateService: SkillEditorStateService,
    private skillUpdateService: SkillUpdateService,
    private skillEditorStateService: SkillEditorStateService,
    private undoRedoService: UndoRedoService,
    private urlService: UrlService,
  ) {}

  getActiveTabName(): string {
    return this.skillEditorRoutingService.getActiveTabName();
  }

  isLoadingSkill(): boolean {
    return this.skillEditorStateService.isLoadingSkill();
  }

  isSaveInProgress(): boolean {
    return this.skillEditorStateService.isSavingSkill();
  }

  getChangeListCount(): number {
    return this.undoRedoService.getChangeCount();
  }

  discardChanges(): void {
    this.undoRedoService.clearChanges();
    this.skillEditorStateService.loadSkill(this.urlService.getSkillIdFromUrl());
  }

  getWarningsCount(): number {
    return this.skillEditorStateService.getSkillValidationIssues().length;
  }

  isSkillSaveable(): boolean {
    return (
      this.getChangeListCount() > 0 &&
      this.getWarningsCount() === 0
    );
  }

  saveChanges(): void {
    this.ngbModal.open(SkillEditorSaveModalComponent, {
      backdrop: 'static',
    }).result.then(function(commitMessage) {
      this.skillEditorStateService.saveSkill(commitMessage, () => {
        this.alertsService.addSuccessMessage('Changes Saved.');
      });
    }, () => {
      // Note to developers:
      // This callback is triggered when the Cancel button is clicked.
      // No further action is needed.
    });
  }

  toggleNavigationOptions(): void {
    this.showNavigationOptions = !this.showNavigationOptions;
  }

  selectMainTab(): void {
    this.activeTab = this.ACTIVE_TAB_EDITOR;
    this.skillEditorRoutingService.navigateToMainTab();
  }

  selectPreviewTab(): void {
    this.activeTab = this.ACTIVE_TAB_PREVIEW;
    this.skillEditorRoutingService.navigateToPreviewTab();
  }

  toggleSkillEditOptions(): void {
    this.showSkillEditOptions = !this.showSkillEditOptions;
  }

  selectQuestionsTab(): void {
    // This check is needed because if a skill has unsaved changes to
    // misconceptions, then these will be reflected in the questions
    // created at that time, but if page is refreshed/changes are
    // discarded, the misconceptions won't be saved, but there will be
    // some questions with these now non-existent misconceptions.
    if (this.undoRedoService.getChangeCount() > 0) {
      const modalRef = this.ngbModal.open(
        SavePendingChangesModalComponent, {
          backdrop: true
        });

      modalRef.componentInstance.body = (
        'Please save all pending ' +
        'changes before viewing the questions list.');

      modalRef.result.then(null, function() {
        // Note to developers:
        // This callback is triggered when the Cancel button is clicked.
        // No further action is needed.
      });
    } else {
      this.activeTab = ACTIVE_TAB_QUESTIONS;
      SkillEditorRoutingService.navigateToQuestionsTab();
    }
  };


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.directiveSubscriptions.unsubscribe();
  }
}

angular.module('oppia').directive('oppiaSkillEditorNavbar',
  downgradeComponent({component: SkillEditorNavbarComponent}));

require(
  'components/common-layout-directives/common-elements/' +
  'confirm-or-cancel-modal.controller.ts');
require(
  'components/common-layout-directives/common-elements/' +
  'loading-dots.component.ts');

require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/utilities/url-interpolation.service.ts');
require('pages/skill-editor-page/services/skill-editor-routing.service.ts');
require('pages/skill-editor-page/services/skill-editor-state.service.ts');
require('services/alerts.service.ts');
require('services/contextual/url.service.ts');
require('services/ngb-modal.service.ts');

require('pages/skill-editor-page/skill-editor-page.constants.ajs.ts');

angular.module('oppia').directive('skillEditorNavbar', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/skill-editor-page/navbar/skill-editor-navbar.directive.html'),
      controller: [
        '$rootScope', '$scope', 'AlertsService', 'NgbModal',
        'SkillEditorRoutingService', 'SkillEditorStateService',
        'SkillUpdateService', 'UndoRedoService', 'UrlService',
        function(
            $rootScope, this, AlertsService, NgbModal,
            SkillEditorRoutingService, SkillEditorStateService,
            SkillUpdateService, UndoRedoService, UrlService) {
          var ctrl = this;
          ctrl.directiveSubscriptions = new Subscription();
          var ACTIVE_TAB_EDITOR = 'Editor';
          var ACTIVE_TAB_QUESTIONS = 'Questions';
          var ACTIVE_TAB_PREVIEW = 'Preview';
          this.getActiveTabName = function() {
            return SkillEditorRoutingService.getActiveTabName();
          };

          this.isLoadingSkill = function() {
            return SkillEditorStateService.isLoadingSkill();
          };

          this.isSaveInProgress = function() {
            return SkillEditorStateService.isSavingSkill();
          };

          this.getChangeListCount = function() {
            return UndoRedoService.getChangeCount();
          };

          this.discardChanges = function() {
            UndoRedoService.clearChanges();
            SkillEditorStateService.loadSkill(UrlService.getSkillIdFromUrl());
          };

          this.getWarningsCount = function() {
            return SkillEditorStateService.getSkillValidationIssues().length;
          };

          this.isSkillSaveable = function() {
            return (
              this.getChangeListCount() > 0 &&
              this.getWarningsCount() === 0
            );
          };

          this.saveChanges = function() {
            NgbModal.open(SkillEditorSaveModalComponent, {
              backdrop: 'static',
            }).result.then(function(commitMessage) {
              SkillEditorStateService.saveSkill(commitMessage, () => {
                AlertsService.addSuccessMessage('Changes Saved.');
                $rootScope.$applyAsync();
              });
            }, function() {
              // Note to developers:
              // This callback is triggered when the Cancel button is clicked.
              // No further action is needed.
            });
          };

          this.toggleNavigationOptions = function() {
            this.showNavigationOptions = !$scope.showNavigationOptions;
          };
          this.selectMainTab = function() {
            this.activeTab = ACTIVE_TAB_EDITOR;
            SkillEditorRoutingService.navigateToMainTab();
          };
          this.selectPreviewTab = function() {
            this.activeTab = ACTIVE_TAB_PREVIEW;
            SkillEditorRoutingService.navigateToPreviewTab();
          };
          this.toggleSkillEditOptions = function() {
            this.showSkillEditOptions = !$scope.showSkillEditOptions;
          };
          this.selectQuestionsTab = function() {
            // This check is needed because if a skill has unsaved changes to
            // misconceptions, then these will be reflected in the questions
            // created at that time, but if page is refreshed/changes are
            // discarded, the misconceptions won't be saved, but there will be
            // some questions with these now non-existent misconceptions.
            if (UndoRedoService.getChangeCount() > 0) {
              const modalRef = NgbModal.open(
                SavePendingChangesModalComponent, {
                  backdrop: true
                });

              modalRef.componentInstance.body = (
                'Please save all pending ' +
                'changes before viewing the questions list.');

              modalRef.result.then(null, function() {
                // Note to developers:
                // This callback is triggered when the Cancel button is clicked.
                // No further action is needed.
              });
            } else {
              this.activeTab = ACTIVE_TAB_QUESTIONS;
              SkillEditorRoutingService.navigateToQuestionsTab();
            }
          };

          ctrl.$onInit = function() {
            this.activeTab = ACTIVE_TAB_EDITOR;
            ctrl.directiveSubscriptions.add(
              SkillEditorStateService.onSkillChange.subscribe(
                () => {
                  ctrl.skill = SkillEditorStateService.getSkill();
                  $rootScope.$applyAsync();
                }),
              SkillUpdateService.onPrerequisiteSkillChange.subscribe(
                () => {
                  this.$applyAsync();
                }
              )
            );
          };
        }]
    };
  }
]);
