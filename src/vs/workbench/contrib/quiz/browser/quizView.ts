/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './quiz.css';
import { localize2 } from '../../../../nls.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { QUIZ_VIEW_ID } from '../common/quiz.js';

export class QuizView extends ViewPane {

	static readonly ID = QUIZ_VIEW_ID;
	static readonly NAME = localize2('quiz', 'Quiz');

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		// Create the main layout container with two columns
		const layoutContainer = document.createElement('div');
		layoutContainer.className = 'quiz-layout';
		layoutContainer.style.display = 'flex';
		layoutContainer.style.height = '100%';
		layoutContainer.style.width = '100%';
		layoutContainer.style.overflow = 'hidden';

		// Left column: OPERATIVES
		const operativesColumn = document.createElement('div');
		operativesColumn.className = 'quiz-operatives-column';
		operativesColumn.style.flex = '0 0 200px';
		operativesColumn.style.borderRight = '1px solid var(--vscode-panel-border)';
		operativesColumn.style.overflowY = 'auto';
		operativesColumn.style.backgroundColor = 'var(--vscode-sideBar-background)';

		// Operatives header
		const operativesHeader = document.createElement('div');
		operativesHeader.className = 'quiz-operatives-header';
		operativesHeader.style.padding = '8px 12px';
		operativesHeader.style.fontSize = '11px';
		operativesHeader.style.fontWeight = 'bold';
		operativesHeader.style.color = 'var(--vscode-sideBar-foreground)';
		operativesHeader.style.borderBottom = '1px solid var(--vscode-panel-border)';
		operativesHeader.style.textTransform = 'uppercase';
		operativesHeader.style.letterSpacing = '0.5px';
		operativesHeader.textContent = '👥 OPERATIVES';
		operativesColumn.appendChild(operativesHeader);

		// Operatives list
		const operativesList = document.createElement('div');
		operativesList.className = 'quiz-operatives-list';
		operativesList.style.padding = '4px';
		operativesList.innerHTML = `
			<div style="padding: 8px; font-size: 12px; color: var(--vscode-sideBar-foreground); cursor: pointer; border-radius: 4px; margin-bottom: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--vscode-list-hoverBackground)'" onmouseout="this.style.backgroundColor='transparent'">
				🧠 Architect
			</div>
			<div style="padding: 8px; font-size: 12px; color: var(--vscode-sideBar-foreground); cursor: pointer; border-radius: 4px; margin-bottom: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--vscode-list-hoverBackground)'" onmouseout="this.style.backgroundColor='transparent'">
				🎨 Visualist
			</div>
			<div style="padding: 8px; font-size: 12px; color: var(--vscode-sideBar-foreground); cursor: pointer; border-radius: 4px; margin-bottom: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--vscode-list-hoverBackground)'" onmouseout="this.style.backgroundColor='transparent'">
				⚙️ Logician
			</div>
			<div style="padding: 8px; font-size: 12px; color: var(--vscode-sideBar-foreground); cursor: pointer; border-radius: 4px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--vscode-list-hoverBackground)'" onmouseout="this.style.backgroundColor='transparent'">
				🔨 Builder
			</div>
		`;
		operativesColumn.appendChild(operativesList);

		// Right column: Chat Interface
		const chatColumn = document.createElement('div');
		chatColumn.className = 'quiz-chat-column';
		chatColumn.style.flex = '1';
		chatColumn.style.display = 'flex';
		chatColumn.style.flexDirection = 'column';
		chatColumn.style.backgroundColor = 'var(--vscode-editor-background)';

		// Chat header
		const chatHeader = document.createElement('div');
		chatHeader.className = 'quiz-chat-header';
		chatHeader.style.padding = '8px 12px';
		chatHeader.style.fontSize = '11px';
		chatHeader.style.fontWeight = 'bold';
		chatHeader.style.color = 'var(--vscode-editor-foreground)';
		chatHeader.style.borderBottom = '1px solid var(--vscode-panel-border)';
		chatHeader.style.backgroundColor = 'var(--vscode-sideBar-background)';
		chatHeader.textContent = '💬 CHAT WITH ARCHITECT';
		chatColumn.appendChild(chatHeader);

		// Chat messages area
		const chatMessages = document.createElement('div');
		chatMessages.className = 'quiz-chat-messages';
		chatMessages.style.flex = '1';
		chatMessages.style.overflowY = 'auto';
		chatMessages.style.padding = '12px';
		chatMessages.style.display = 'flex';
		chatMessages.style.flexDirection = 'column';
		chatMessages.style.gap = '8px';
		chatMessages.innerHTML = `
			<div style="padding: 8px; background-color: var(--vscode-inputOption-activeBorder); border-radius: 4px; font-size: 12px; color: var(--vscode-editor-foreground);">
				<div style="font-weight: bold; margin-bottom: 4px;">🧠 Architect</div>
				<div style="opacity: 0.8;">Welcome to the Quiz interface. I'm ready to help you with your coding challenges.</div>
			</div>
		`;
		chatColumn.appendChild(chatMessages);

		// Chat input area
		const chatInput = document.createElement('div');
		chatInput.className = 'quiz-chat-input';
		chatInput.style.padding = '12px';
		chatInput.style.borderTop = '1px solid var(--vscode-panel-border)';
		chatInput.style.backgroundColor = 'var(--vscode-sideBar-background)';
		chatInput.innerHTML = `
			<div style="display: flex; gap: 8px;">
				<input type="text" placeholder="Ask a question..." style="flex: 1; padding: 8px; border: 1px solid var(--vscode-input-border); border-radius: 4px; background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); font-size: 12px;" />
				<button style="padding: 8px 16px; background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">Send</button>
			</div>
		`;
		chatColumn.appendChild(chatInput);

		// Assemble layout
		layoutContainer.appendChild(operativesColumn);
		layoutContainer.appendChild(chatColumn);

		container.appendChild(layoutContainer);
	}
}
