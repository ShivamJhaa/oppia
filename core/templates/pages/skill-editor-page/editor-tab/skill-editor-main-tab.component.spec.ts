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
 * @fileoverview Unit tests for the skill editor main tab component.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FocusManagerService } from 'services/stateful/focus-manager.service';
import { SkillEditorMainTabComponent } from './skill-editor-main-tab.component';
import { SkillEditorStateService } from '../services/skill-editor-state.service';
import { UndoRedoService } from 'domain/editor/undo_redo/undo-redo.service';

class MockNgbModalRef {
  componentInstance: {
    body: 'xyz';
  };
}

describe('Skill editor main tab directive', () => {
  let component: SkillEditorMainTabComponent;
  let fixture: ComponentFixture<SkillEditorMainTabComponent>;
  let undoRedoService: UndoRedoService;
  let ngbModal: NgbModal;
  let skillEditorRoutingService: SkillEditorRoutingService;
  let skillEditorStateService: SkillEditorStateService;
  let focusManagerService: FocusManagerService;
  let assignedSkillTopicData = {topic1: 'subtopic1', topic2: 'subtopic2'};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        SkillEditorMainTabComponent
      ],
      providers: [
        FocusManagerService,
        NgbModal,
        SkillEditorStateService,
        skillEditorRoutingService,
        UndoRedoService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditorMainTabComponent);
    component = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);
    skillEditorStateService = TestBed.inject(SkillEditorStateService);
    undoRedoService = TestBed.inject(UndoRedoService);
    focusManagerService = TestBed.inject(FocusManagerService);
    skillEditorRoutingService = TestBed.inject(SkillEditorRoutingService);

    component.ngOnInit();
  });

  it('should initialize the variables', () => {
    expect(component.selectedTopic).toBeNull();
    expect(component.subtopicName).toBeNull();
  });

  it('should navigate to questions tab when unsaved changes are not present',
    () => {
      spyOn(undoRedoService, 'getChangeCount').and.returnValue(0);
      let routingSpy = spyOn(
        skillEditorRoutingService, 'navigateToQuestionsTab').and.callThrough();

      component.createQuestion();

      expect(routingSpy).toHaveBeenCalled();
      let createQuestionEventSpyon = spyOn(
        skillEditorRoutingService, 'creatingNewQuestion')
        .and.callThrough();

      component.createQuestion();

      expect(createQuestionEventSpyon).toHaveBeenCalled();
    });

  it('should return if skill has been loaded', () => {
    expect(component.hasLoadedSkill()).toBeFalse();

    spyOn(skillEditorStateService, 'hasLoadedSkill').and.returnValue(true);

    expect(component.hasLoadedSkill()).toBeTrue();
  });

  it('should open save changes modal with $uibModal when unsaved changes are' +
  ' present', () => {
    spyOn(undoRedoService, 'getChangeCount').and.returnValue(1);
    const modalSpy = spyOn(ngbModal, 'open').and.callFake((dlg, opt) => {
      return ({
        componentInstance: MockNgbModalRef,
        result: Promise.resolve()
      }) as NgbModalRef;
    });

    component.createQuestion();

    expect(modalSpy).toHaveBeenCalled();
  });

  it('should return assigned Skill Topic Data', () => {
    expect(component.assignedSkillTopicData).toBeNull();
    expect(component.getAssignedSkillTopicData()).toBeNull();

    component.assignedSkillTopicData = assignedSkillTopicData;

    expect(component.getAssignedSkillTopicData()).toEqual(
      assignedSkillTopicData);
  });

  it('should return subtopic name', () => {
    expect(component.subtopicName).toBeNull();

    component.subtopicName = 'Subtopic1';

    expect(component.getSubtopicName()).toEqual('Subtopic1');
  });

  it('should change subtopic when selected topic is changed', () => {
    component.assignedSkillTopicData = assignedSkillTopicData;

    component.changeSelectedTopic('topic1');

    expect(component.getSubtopicName()).toEqual(assignedSkillTopicData.topic1);

    component.changeSelectedTopic('topic2');

    expect(component.getSubtopicName()).toEqual(assignedSkillTopicData.topic2);
  });

  it('should return whether the topic dropdown is enabled', () => {
    expect(component.isTopicDropdownEnabled()).toBeFalse();

    component.assignedSkillTopicData = assignedSkillTopicData;

    expect(component.isTopicDropdownEnabled()).toBeTrue();
  });

  it('should set focus on create question button', fakeAsync(() => {
    let focusSpy = spyOn(focusManagerService, 'setFocus');

    component.ngOnInit();
    tick();

    expect(focusSpy).toHaveBeenCalled();
  }));
});
