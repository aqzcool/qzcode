/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Part } from '../../part.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { LayoutPriority, IViewSize } from '../../../../base/browser/ui/grid/grid.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { mainWindow } from '../../../../base/browser/window.js';

/**
 * ChatPart is a lightweight part for the Chat column in the four-column layout.
 * It serves as a placeholder in the grid system and doesn't contain pane composites.
 */
export class ChatPart extends Part {

	readonly minimumWidth: number = 200;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

	readonly priority: LayoutPriority = LayoutPriority.Low;
	readonly snap: boolean = true;

	protected override readonly _onDidChange = this._register(new Emitter<IViewSize | undefined>());
	override get onDidChange(): Event<IViewSize | undefined> {
		return this._onDidChange.event;
	}

	constructor(
		themeService: IThemeService,
		storageService: IStorageService,
		layoutService: IWorkbenchLayoutService
	) {
		super(Parts.CHAT_PART, { hasTitle: false }, themeService, storageService, layoutService);
	}

	override create(parent: HTMLElement): void {
		super.create(parent);

		// Create the element for the chat part
		const element = document.createElement('div');
		element.classList.add('chat-part');
		parent.appendChild(element);

		// Create Quiz layout (OPERATIVES + Chat)
		const quizLayout = document.createElement('div');
		quizLayout.classList.add('chat-part-layout');

		// Left: OPERATIVES column
		const operativesColumn = document.createElement('div');
		operativesColumn.classList.add('operatives-column');

		const operativesHeader = document.createElement('div');
		operativesHeader.classList.add('operatives-header');
		const headerText = document.createElement('span');
		headerText.textContent = 'OPERATIVES';
		operativesHeader.appendChild(headerText);
		operativesColumn.appendChild(operativesHeader);

		const operativesList = document.createElement('div');
		operativesList.classList.add('operatives-list');

		// Create operative items with enhanced styling
		const operatives = [
			{ name: 'Architect', icon: '🧠', color: 'purple' },
			{ name: 'Coder', icon: '💻', color: 'cyan' },
			{ name: 'Reviewer', icon: '👁️', color: 'orange' }
		];
		operatives.forEach((operative, index) => {
			const operativeItem = document.createElement('div');
			operativeItem.classList.add('operative-item');
			if (index === 0) {
				operativeItem.classList.add('active');
			}
			operativeItem.setAttribute('data-role', operative.color);

			const itemContent = document.createElement('div');
			itemContent.style.display = 'flex';
			itemContent.style.alignItems = 'center';
			itemContent.style.gap = '8px';

			const icon = document.createElement('span');
			icon.textContent = operative.icon;
			icon.style.fontSize = '14px';

			const name = document.createElement('span');
			name.textContent = operative.name;

			itemContent.appendChild(icon);
			itemContent.appendChild(name);
			operativeItem.appendChild(itemContent);

			operativeItem.addEventListener('click', () => {
				operativesList.querySelectorAll('.operative-item').forEach(item => {
					item.classList.remove('active');
				});
				operativeItem.classList.add('active');
			});

			operativesList.appendChild(operativeItem);
		});
		operativesColumn.appendChild(operativesList);
		quizLayout.appendChild(operativesColumn);

		// Right: Chat column
		const chatColumn = document.createElement('div');
		chatColumn.classList.add('chat-column');

		const chatHeader = document.createElement('div');
		chatHeader.classList.add('chat-header');
		chatHeader.textContent = '💬 QUIZ CHAT';
		chatColumn.appendChild(chatHeader);

		const chatMessages = document.createElement('div');
		chatMessages.classList.add('chat-messages');

		// Create welcome message
		const welcomeDiv = document.createElement('div');
		welcomeDiv.classList.add('chat-welcome');

		const welcomeIcon = document.createElement('div');
		welcomeIcon.classList.add('chat-welcome-icon');
		welcomeIcon.textContent = '👋';
		welcomeDiv.appendChild(welcomeIcon);

		const welcomeTitle = document.createElement('div');
		welcomeTitle.style.fontWeight = '600';
		welcomeTitle.style.fontSize = '13px';
		welcomeTitle.textContent = 'Welcome to Quiz';
		welcomeDiv.appendChild(welcomeTitle);

		const welcomeSubtitle = document.createElement('div');
		welcomeSubtitle.classList.add('chat-welcome-text');
		welcomeSubtitle.textContent = 'Select an operative to start';
		welcomeDiv.appendChild(welcomeSubtitle);

		chatMessages.appendChild(welcomeDiv);
		chatColumn.appendChild(chatMessages);

		// Input area
		const chatInput = document.createElement('div');
		chatInput.classList.add('chat-input-area');

		const inputWrapper = document.createElement('div');
		inputWrapper.classList.add('chat-input-wrapper');

		const inputField = document.createElement('textarea');
		inputField.classList.add('chat-input-field');
		inputField.placeholder = 'Ask a question...';
		inputField.rows = 1;

		const sendButton = document.createElement('button');
		sendButton.classList.add('chat-send-button');
		sendButton.textContent = 'Send';

		sendButton.addEventListener('click', () => {
			const text = inputField.value.trim();
			if (text) {
				this.addMessage(text, 'user');
				inputField.value = '';
				inputField.style.height = 'auto';
			}
		});

		inputField.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendButton.click();
			}
		});

		inputField.addEventListener('input', () => {
			inputField.style.height = 'auto';
			inputField.style.height = Math.min(inputField.scrollHeight, 120) + 'px';
		});

		inputWrapper.appendChild(inputField);
		inputWrapper.appendChild(sendButton);
		chatInput.appendChild(inputWrapper);

		const inputFooter = document.createElement('div');
		inputFooter.classList.add('chat-input-footer');

		const footerLeft = document.createElement('span');
		footerLeft.textContent = 'SHIFT+ENTER for new line';
		inputFooter.appendChild(footerLeft);

		const footerRight = document.createElement('span');
		footerRight.classList.add('chat-input-status');

		const statusIndicator = document.createElement('span');
		statusIndicator.classList.add('status-indicator');
		footerRight.appendChild(statusIndicator);

		const statusText = document.createElement('span');
		statusText.textContent = 'SECURE CONNECTION';
		footerRight.appendChild(statusText);

		inputFooter.appendChild(footerRight);
		chatInput.appendChild(inputFooter);

		chatColumn.appendChild(chatInput);
		quizLayout.appendChild(chatColumn);

		element.appendChild(quizLayout);
		this.element = element;

		// Load CSS
		this.loadStyles();
	}

	private loadStyles(): void {
		// Check if styles are already loaded
		if (mainWindow.document.getElementById('chat-part-styles')) {
			return;
		}

		// Create style element with CSS content
		const style = mainWindow.document.createElement('style');
		style.id = 'chat-part-styles';
		style.textContent = this.getStylesContent();
		mainWindow.document.head.appendChild(style);
	}

	private getStylesContent(): string {
		// Return the CSS content directly
		return `
/* Chat Part Styles - Tailwind-inspired Design */
/* Color Palette from dual-brain-code-studio */

:root {
	--brand-bg: #0d0d0d;
	--brand-surface: #151515;
	--brand-purple: #9333ea;
	--brand-cyan: #06b6d4;
	--dark-0: #0a0a0a;
	--dark-1: #0f0f0f;
	--dark-2: #111111;
	--dark-3: #141414;
	--gray-600: #666666;
	--gray-500: #808080;
	--gray-400: #a0a0a0;
	--gray-300: #b0b0b0;
	--gray-200: #d0d0d0;
	--gray-100: #e5e5e5;
}

.chat-part {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: var(--dark-0);
	color: #ffffff;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-part-layout {
	display: flex;
	height: 100%;
	width: 100%;
	gap: 0;
}

/* Operatives Column */
.operatives-column {
	flex: 0 0 180px;
	border-right: 1px solid rgba(255, 255, 255, 0.08);
	overflow-y: auto;
	background-color: var(--dark-1);
	display: flex;
	flex-direction: column;
}

.operatives-header {
	padding: 12px 12px;
	font-size: 10px;
	font-weight: 700;
	color: var(--gray-500);
	text-transform: uppercase;
	letter-spacing: 0.8px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	flex-shrink: 0;
	background-color: var(--dark-0);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.operatives-list {
	padding: 8px 4px;
	flex: 1;
	overflow-y: auto;
}

.operative-item {
	padding: 10px 8px;
	font-size: 12px;
	color: var(--gray-300);
	cursor: pointer;
	border-radius: 6px;
	margin-bottom: 4px;
	transition: all 0.2s ease;
	border-left: 3px solid transparent;
	user-select: none;
	position: relative;
	display: flex;
	align-items: center;
}

.operative-item:hover {
	background-color: rgba(255, 255, 255, 0.05);
	color: var(--gray-100);
	border-left-color: var(--brand-purple);
}

.operative-item.active {
	background-color: var(--brand-purple);
	color: #ffffff;
	border-left-color: var(--brand-purple);
	font-weight: 600;
	box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
}

.operative-item[data-role="purple"].active {
	background-color: #9333ea;
}

.operative-item[data-role="cyan"].active {
	background-color: #06b6d4;
}

.operative-item[data-role="orange"].active {
	background-color: #f97316;
}

/* Chat Column */
.chat-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	background-color: var(--dark-2);
	border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-header {
	padding: 12px 12px;
	font-size: 10px;
	font-weight: 700;
	color: var(--gray-400);
	text-transform: uppercase;
	letter-spacing: 0.8px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	background-color: var(--dark-3);
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
	height: 40px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.chat-header-icon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: 16px 12px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: var(--dark-2);
}

.chat-message {
	display: flex;
	gap: 12px;
	animation: fadeIn 0.3s ease-out;
	max-width: 100%;
}

.chat-message.user {
	flex-direction: row-reverse;
}

.chat-message-avatar {
	width: 32px;
	height: 32px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 700;
	flex-shrink: 0;
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.chat-message-avatar.user {
	background-color: var(--gray-200);
	color: #000000;
}

.chat-message-avatar.architect {
	background-color: var(--brand-purple);
	color: #ffffff;
}

.chat-message-avatar.assistant {
	background-color: var(--brand-cyan);
	color: #ffffff;
}

.chat-message-content {
	display: flex;
	flex-direction: column;
	max-width: 80%;
	gap: 4px;
}

.chat-message.user .chat-message-content {
	align-items: flex-end;
}

.chat-message-meta {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0 4px;
	font-size: 10px;
}

.chat-message-sender {
	font-weight: 600;
	color: var(--gray-400);
}

.chat-message-time {
	color: var(--gray-600);
	font-family: 'JetBrains Mono', 'Courier New', monospace;
	font-size: 9px;
}

.chat-message-text {
	padding: 10px 12px;
	font-size: 12px;
	line-height: 1.5;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	white-space: pre-wrap;
	word-break: break-word;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.chat-message.user .chat-message-text {
	background-color: #2a2a2a;
	color: var(--gray-100);
	border-color: rgba(255, 255, 255, 0.1);
	border-top-right-radius: 2px;
}

.chat-message.architect .chat-message-text {
	background-color: rgba(147, 51, 234, 0.1);
	color: #e9d5ff;
	border-color: rgba(147, 51, 234, 0.3);
	border-top-left-radius: 2px;
}

.chat-message.assistant .chat-message-text {
	background-color: rgba(6, 182, 212, 0.1);
	color: #cffafe;
	border-color: rgba(6, 182, 212, 0.3);
	border-top-left-radius: 2px;
}

.chat-welcome {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
	opacity: 0.5;
	gap: 12px;
}

.chat-welcome-icon {
	width: 48px;
	height: 48px;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
}

.chat-welcome-text {
	font-size: 12px;
	color: var(--gray-600);
}

/* Input Area */
.chat-input-area {
	padding: 12px;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	background-color: var(--dark-2);
	flex-shrink: 0;
}

.chat-input-wrapper {
	position: relative;
	display: flex;
	gap: 8px;
	align-items: flex-end;
}

.chat-input-field {
	flex: 1;
	padding: 10px 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	background-color: var(--dark-0);
	color: #ffffff;
	font-size: 12px;
	font-family: inherit;
	resize: none;
	max-height: 120px;
	transition: all 0.2s ease;
	line-height: 1.4;
}

.chat-input-field:focus {
	outline: none;
	border-color: var(--brand-purple);
	box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.15);
	background-color: rgba(10, 10, 10, 0.8);
}

.chat-input-field::placeholder {
	color: var(--gray-600);
}

.chat-send-button {
	padding: 8px 16px;
	background-color: var(--brand-purple);
	color: #ffffff;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 12px;
	font-weight: 600;
	transition: all 0.2s ease;
	white-space: nowrap;
	flex-shrink: 0;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chat-send-button:hover:not(:disabled) {
	background-color: #a855f7;
	box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
	transform: translateY(-1px);
}

.chat-send-button:active:not(:disabled) {
	transform: translateY(0);
}

.chat-send-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.chat-input-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 6px;
	padding: 0 4px;
	font-size: 9px;
	color: var(--gray-600);
	font-family: 'JetBrains Mono', 'Courier New', monospace;
}

.chat-input-status {
	display: flex;
	align-items: center;
	gap: 4px;
}

.status-indicator {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #10b981;
	box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar,
.operatives-list::-webkit-scrollbar {
	width: 6px;
}

.chat-messages::-webkit-scrollbar-track,
.operatives-list::-webkit-scrollbar-track {
	background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb,
.operatives-list::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 3px;
	transition: background 0.2s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.operatives-list::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Loading Animation */
.chat-loading {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px;
	animation: fadeIn 0.3s ease-out;
}

.chat-loading-spinner {
	width: 16px;
	height: 16px;
	border: 2px solid rgba(147, 51, 234, 0.2);
	border-top-color: var(--brand-purple);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	flex-shrink: 0;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.chat-loading-text {
	font-size: 11px;
	color: var(--brand-purple);
	font-family: 'JetBrains Mono', 'Courier New', monospace;
	animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

/* System Message */
.chat-system-message {
	display: flex;
	justify-content: center;
	width: 100%;
	margin: 8px 0;
	opacity: 0.7;
}

.chat-system-message-text {
	font-size: 10px;
	color: var(--brand-cyan);
	background-color: rgba(6, 182, 212, 0.1);
	padding: 6px 12px;
	border-radius: 12px;
	border: 1px solid rgba(6, 182, 212, 0.3);
	font-family: 'JetBrains Mono', 'Courier New', monospace;
}
		`;
	}

	private addMessage(text: string, role: 'user' | 'assistant' | 'architect'): void {
		const chatMessages = this.element?.querySelector('.chat-messages') as HTMLElement;
		if (!chatMessages) return;

		// Remove welcome message if it exists
		const welcome = chatMessages.querySelector('.chat-welcome');
		if (welcome) {
			welcome.remove();
		}

		const messageDiv = document.createElement('div');
		messageDiv.classList.add('chat-message', role);

		const avatar = document.createElement('div');
		avatar.classList.add('chat-message-avatar', role);
		avatar.textContent = role === 'user' ? 'U' : (role === 'architect' ? 'A' : 'C');

		const content = document.createElement('div');
		content.classList.add('chat-message-content');

		const meta = document.createElement('div');
		meta.classList.add('chat-message-meta');

		const sender = document.createElement('span');
		sender.classList.add('chat-message-sender');
		sender.textContent = role === 'user' ? 'You' : (role === 'architect' ? 'Architect' : 'Coder');

		const time = document.createElement('span');
		time.classList.add('chat-message-time');
		time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

		meta.appendChild(sender);
		meta.appendChild(time);
		content.appendChild(meta);

		const messageText = document.createElement('div');
		messageText.classList.add('chat-message-text');
		messageText.textContent = text;

		content.appendChild(messageText);
		messageDiv.appendChild(avatar);
		messageDiv.appendChild(content);

		chatMessages.appendChild(messageDiv);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		this._onDidVisibilityChange.fire(visible);
	}

	override layout(width: number, height: number, top: number, left: number): void {
		// Layout the chat part
		this.element.style.width = `${width}px`;
		this.element.style.height = `${height}px`;
		this.element.style.top = `${top}px`;
		this.element.style.left = `${left}px`;
	}

	override toJSON(): object {
		return { type: Parts.CHAT_PART };
	}
}
