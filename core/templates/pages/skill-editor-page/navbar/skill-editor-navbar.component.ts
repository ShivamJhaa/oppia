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
import { Component, OnInit } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { AlertsService } from 'services/alerts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'oppia-skill-editor-navbar',
  templateUrl: './skill-editor-navbar.component.html'
})
export class SkillEditorNavbarComponent implements OnInit {
  directiveSubscriptions: Subscription = new Subscription();
  ACTIVE_TAB_EDITOR: string = 'Editor';
  ACTIVE_TAB_QUESTIONS: string = 'Questions';
  ACTIVE_TAB_PREVIEW: string = 'Preview';

  constructor(
    private alertsService: AlertsService,
    private ngbModal: NgbModal,
    private skillEditorRoutingService: SkillEditorRoutingService,
    private ngbModal: NgbModal,
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.directiveSubscriptions.unsubscribe();
  }
}

angular.module('oppia').directive('oppiaSkillEditorNavbar',
  downgradeComponent({component: SkillEditorNavbarComponent}));
