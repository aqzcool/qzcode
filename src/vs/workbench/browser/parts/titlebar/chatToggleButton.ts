/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener } from '../../../../base/browser/dom.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';

export class ChatToggleButton extends Disposable {

	private button: HTMLElement;
	private isVisible: boolean = true;

	constructor(
		container: HTMLElement,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService
	) {
		super();

		// Create button
		this.button = $('button.chat-toggle-button');
		this.button.setAttribute('title', 'Toggle Chat Column (Ctrl+Shift+J)');
		this.button.setAttribute('aria-label', 'Toggle Chat Column');
		this.button.style.cssText = `
			padding: 4px 8px;
			margin: 0 4px;
			background-color: transparent;
			border: 1px solid var(--vscode-button-border, transparent);
			color: var(--vscode-foreground);
			cursor: pointer;
			border-radius: 2px;
			font-size: 12px;
			display: flex;
			align-items: center;
			gap: 4px;
			transition: background-color 0.2s;
		`;

		// SVG icon for chat - create elements instead of using innerHTML for sandbox security
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '16');
		svg.setAttribute('height', '16');
		svg.setAttribute('viewBox', '0 0 16 16');
		svg.setAttribute('fill', 'currentColor');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M8 1C4.1 1 1 3.6 1 7c0 1.5.6 2.9 1.6 4l-1.4 3.5c-.1.3 0 .6.3.7.1 0 .2.1.3.1.2 0 .4-.1.5-.3l2.2-2.8c.6.2 1.3.3 2 .3 3.9 0 7-2.6 7-6s-3.1-6-7-6z');
		svg.appendChild(path);

		const span = document.createElement('span');
		span.textContent = 'Chat';

		this.button.appendChild(svg);
		this.button.appendChild(span);

		// Add click handler
		this._register(addDisposableListener(this.button, 'click', () => this.toggleChat()));

		container.appendChild(this.button);

		// Update button state based on layout
		this.updateButtonState();
	}

	private toggleChat(): void {
		const isHidden = this.layoutService.isVisible(Parts.CHAT_PART);
		this.layoutService.setPartHidden(!isHidden, Parts.CHAT_PART);
		this.updateButtonState();
	}

	private updateButtonState(): void {
		this.isVisible = this.layoutService.isVisible(Parts.CHAT_PART);
		if (this.isVisible) {
			this.button.style.backgroundColor = 'var(--vscode-button-background)';
			this.button.style.color = 'var(--vscode-button-foreground)';
		} else {
			this.button.style.backgroundColor = 'transparent';
			this.button.style.color = 'var(--vscode-foreground)';
		}
	}
}
