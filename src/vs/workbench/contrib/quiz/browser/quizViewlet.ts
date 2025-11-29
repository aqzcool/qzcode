/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { QUIZ_VIEWLET_ID } from '../common/quiz.js';
import { IViewDescriptor, IViewContainersRegistry, ViewContainerLocation, Extensions, IViewDescriptorService } from '../../../common/views.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { QuizView } from './quizView.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';

const quizViewIcon = registerIcon('quiz-view-icon', Codicon.lightbulb, 'View icon of the quiz view.');

export class QuizViewletViewsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.quizViewletViews';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super();
		this.registerViews();
	}

	private registerViews(): void {
		const viewDescriptor: IViewDescriptor = {
			id: QuizView.ID,
			name: QuizView.NAME,
			containerIcon: quizViewIcon,
			ctorDescriptor: new SyncDescriptor(QuizView),
			order: 1,
			canToggleVisibility: true,
			canMoveView: true,
		};

		const viewsRegistry = Registry.as<any>(Extensions.ViewsRegistry);
		viewsRegistry.registerViews([viewDescriptor], VIEW_CONTAINER);
	}
}

export class QuizViewPaneContainer extends ViewPaneContainer {

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IExtensionService extensionService: IExtensionService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {
		super(QUIZ_VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		parent.classList.add('quiz-viewlet');
	}
}

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry);

/**
 * Quiz viewlet container.
 */
export const VIEW_CONTAINER = viewContainerRegistry.registerViewContainer({
	id: QUIZ_VIEWLET_ID,
	title: localize2('quiz', 'Quiz'),
	ctorDescriptor: new SyncDescriptor(QuizViewPaneContainer),
	storageId: 'workbench.quiz.views.state',
	icon: quizViewIcon,
	alwaysUseContainerInfo: true,
	hideIfEmpty: false,
	order: 5,
	openCommandActionDescriptor: {
		id: QUIZ_VIEWLET_ID,
		title: localize2('quiz', 'Quiz'),
		mnemonicTitle: localize({ key: 'miViewQuiz', comment: ['&& denotes a mnemonic'] }, '&&Quiz'),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyQ },
		order: 5
	},
}, ViewContainerLocation.ChatColumn);
