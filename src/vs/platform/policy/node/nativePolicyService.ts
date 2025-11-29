/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractPolicyService, IPolicyService, PolicyDefinition } from '../common/policy.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Throttler } from '../../../base/common/async.js';
import type { PolicyUpdate, Watcher } from '@vscode/policy-watcher';
import { MutableDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../log/common/log.js';

export class NativePolicyService extends AbstractPolicyService implements IPolicyService {

	private throttler = new Throttler();
	private readonly watcher = this._register(new MutableDisposable<Watcher>());

	constructor(
		@ILogService private readonly logService: ILogService,
		private readonly productName: string
	) {
		super();
	}

	protected async _updatePolicyDefinitions(policyDefinitions: IStringDictionary<PolicyDefinition>): Promise<void> {
		this.logService.trace(`NativePolicyService#_updatePolicyDefinitions - Found ${Object.keys(policyDefinitions).length} policy definitions`);

		try {
			const { createWatcher } = await import('@vscode/policy-watcher');

			await this.throttler.queue(() => new Promise<void>((c, e) => {
				try {
					let completed = false;
					this.watcher.value = createWatcher(this.productName, policyDefinitions, (update: PolicyUpdate<IStringDictionary<PolicyDefinition>>) => {
						try {
							this._onDidPolicyChange(update);
						} catch (err) {
							this.logService.error(`NativePolicyService#_onDidPolicyChange - Error handling policy change:`, err);
						}
						if (!completed) {
							completed = true;
							c();
						}
					});
					// Resolve immediately if watcher is created successfully
					if (!completed) {
						completed = true;
						c();
					}
				} catch (err) {
					this.logService.error(`NativePolicyService#_updatePolicyDefinitions - Error creating watcher:`, err);
					e(err);
				}
			}));
		} catch (err) {
			this.logService.error(`NativePolicyService#_updatePolicyDefinitions - Error importing policy-watcher:`, err);
		}
	}

	private _onDidPolicyChange(update: PolicyUpdate<IStringDictionary<PolicyDefinition>>): void {
		if (!update) {
			this.logService.warn(`NativePolicyService#_onDidPolicyChange - Received null or undefined update`);
			return;
		}

		this.logService.trace(`NativePolicyService#_onDidPolicyChange - Updated policy values: ${JSON.stringify(update)}`);

		for (const key in update) {
			const value = update[key] as any;

			if (value === undefined) {
				this.policies.delete(key);
			} else {
				this.policies.set(key, value);
			}
		}

		this._onDidChange.fire(Object.keys(update));
	}
}
