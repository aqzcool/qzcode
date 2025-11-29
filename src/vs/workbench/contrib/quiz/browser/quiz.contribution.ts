/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { QuizViewletViewsContribution } from './quizViewlet.js';

// Register the Quiz viewlet views contribution
registerWorkbenchContribution2(QuizViewletViewsContribution.ID, QuizViewletViewsContribution, WorkbenchPhase.BlockStartup);
