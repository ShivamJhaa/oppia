// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service that handles routing for the skill editor page.
 */

import { Injectable, EventEmitter } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { WindowRef } from 'services/contextual/window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class SkillEditorRoutingService {
  private _MAIN_TAB = 'main';
  private _QUESTIONS_TAB = 'questions';
  private _PREVIEW_TAB = 'preview';
  private _updateViewEventEmitter: EventEmitter<void> = new EventEmitter();
  private _activeTabName = 'main';
  questionIsBeingCreated: boolean;

  constructor(
    private windowRef: WindowRef
  ) {
    let currentHash: string = this.windowRef.nativeWindow.location.hash;
    this._changeTab(currentHash.substring(1, currentHash.length));
  }

  private _changeTab(newHash: string) {
    if (newHash === '/questions') {
      this._activeTabName = this._QUESTIONS_TAB;
    } else if (newHash === '/preview') {
      this._activeTabName = this._PREVIEW_TAB;
    } else {
      this._activeTabName = this._MAIN_TAB;
    }

    this.windowRef.nativeWindow.location.hash = newHash;
    this._updateViewEventEmitter.emit();
  }


  getActiveTabName(): string {
    return this._activeTabName;
  }

  getTabStatuses(): string {
    return this._activeTabName;
  }

  navigateToMainTab(): void {
    this._changeTab('');
  }

  navigateToQuestionsTab(): void {
    this._changeTab('/questions');
  }

  navigateToPreviewTab(): void {
    this._changeTab('/preview');
  }

  // To navigate directly to question-editor interface
  // from skill editor page.
  creatingNewQuestion(editorIsOpen: boolean): void {
    if (editorIsOpen) {
      this.questionIsBeingCreated = true;
    } else {
      this.questionIsBeingCreated = false;
    }
  }

  navigateToQuestionEditor(): boolean {
    return this.questionIsBeingCreated;
  }
}

angular.module('oppia').factory('SkillEditorRoutingService',
  downgradeInjectable(SkillEditorRoutingService));
