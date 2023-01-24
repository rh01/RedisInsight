import { MyRedisDatabasePage, MemoryEfficiencyPage, BrowserPage, CliPage, AddRedisDatabasePage } from '../../../pageObjects';
import { rte } from '../../../helpers/constants';
import { acceptLicenseTermsAndAddDatabaseApi, deleteCustomDatabase } from '../../../helpers/database';
import { commonUrl, ossStandaloneBigConfig, ossStandaloneConfig } from '../../../helpers/conf';
import { deleteStandaloneDatabaseApi } from '../../../helpers/api/api-database';
import { CliActions } from '../../../common-actions/cli-actions';
import { MemoryEfficiencyActions } from '../../../common-actions/memory-efficiency-actions';
import { Common } from '../../../helpers/common';

const memoryEfficiencyPage = new MemoryEfficiencyPage();
const myRedisDatabasePage = new MyRedisDatabasePage();
const cliActions = new CliActions();
const common = new Common();
const browserPage = new BrowserPage();
const cliPage = new CliPage();
const addRedisDatabasePage = new AddRedisDatabasePage();
const memoryEfficiencyActions = new MemoryEfficiencyActions();

const externalPageLink = 'https://docs.redis.com/latest/ri/memory-optimizations/';
let keyName = `recomKey-${common.generateWord(10)}`;
const stringKeyName = `smallStringKey-${common.generateWord(5)}`;
const index = '1';

fixture `Memory Efficiency Recommendations`
    .meta({ type: 'critical_path', rte: rte.standalone })
    .page(commonUrl)
    .beforeEach(async t => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneConfig, ossStandaloneConfig.databaseName);
        // Go to Analysis Tools page
        await t.click(myRedisDatabasePage.analysisPageButton);
    })
    .afterEach(async t => {
        // Clear and delete database
        await t.click(myRedisDatabasePage.browserButton);
        await browserPage.deleteKeyByName(keyName);
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    });
test
    .before(async t => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneBigConfig, ossStandaloneBigConfig.databaseName);
        // Go to Analysis Tools page
        await t.click(myRedisDatabasePage.analysisPageButton);
        // Add cached scripts and generate new report
        await cliActions.addCachedScripts(11);
        await t.click(memoryEfficiencyPage.newReportBtn);
        // Go to Recommendations tab
        await t.click(memoryEfficiencyPage.recommendationsTab);
    })
    .after(async() => {
        await cliPage.sendCommandInCli('SCRIPT FLUSH');
        await deleteStandaloneDatabaseApi(ossStandaloneBigConfig);
    })('Recommendations displaying', async t => {
        const luaScriptCodeChangesLabel = memoryEfficiencyPage.luaScriptAccordion.parent().find(memoryEfficiencyPage.cssCodeChangesLabel);
        const luaScriptConfigurationChangesLabel = memoryEfficiencyPage.luaScriptAccordion.parent().find(memoryEfficiencyPage.cssConfigurationChangesLabel);

        await t.click(memoryEfficiencyPage.newReportBtn);
        // Verify that user can see Avoid dynamic Lua script recommendation when number_of_cached_scripts> 10
        await t.expect(memoryEfficiencyPage.luaScriptAccordion.exists).ok('Avoid dynamic lua script recommendation not displayed');
        // Verify that user can see type of recommendation badge
        await t.expect(luaScriptCodeChangesLabel.exists).ok('Avoid dynamic lua script recommendation not have Code Changes label');
        await t.expect(luaScriptConfigurationChangesLabel.exists).notOk('Avoid dynamic lua script recommendation have Configuration Changes label');

        // Verify that user can see Use smaller keys recommendation when database has 1M+ keys
        await t.expect(memoryEfficiencyPage.useSmallKeysAccordion.exists).ok('Use smaller keys recommendation not displayed');

        // Verify that user can see all the recommendations expanded by default
        await t.expect(memoryEfficiencyPage.luaScriptButton.getAttribute('aria-expanded')).eql('true', 'Avoid dynamic lua script recommendation not expanded');
        await t.expect(memoryEfficiencyPage.useSmallKeysButton.getAttribute('aria-expanded')).eql('true', 'Use smaller keys recommendation not expanded');

        // Verify that user can expand/collapse recommendation
        const expandedTextContaiterSize = await memoryEfficiencyPage.luaScriptTextContainer.offsetHeight;
        await t.click(memoryEfficiencyPage.luaScriptButton);
        await t.expect(memoryEfficiencyPage.luaScriptTextContainer.offsetHeight).lt(expandedTextContaiterSize, 'Lua script recommendation not collapsed');
        await t.click(memoryEfficiencyPage.luaScriptButton);
        await t.expect(memoryEfficiencyPage.luaScriptTextContainer.offsetHeight).eql(expandedTextContaiterSize, 'Lua script recommendation not expanded');

        // Verify that user can navigate by link to see the recommendation
        await t.click(memoryEfficiencyPage.readMoreLink);
        await common.checkURL(externalPageLink);
        // Close the window with external link to switch to the application window
        await t.closeWindow();
    });
test('No recommendations message', async t => {
    keyName = `recomKey-${common.generateWord(10)}`;
    const noRecommendationsMessage = 'No Recommendations at the moment.';
    const command = `HSET ${keyName} field value`;

    // Create Hash key and create report
    await cliPage.sendCommandInCli(command);
    await t.click(memoryEfficiencyPage.newReportBtn);
    // Go to Recommendations tab
    await t.click(memoryEfficiencyPage.recommendationsTab);
    // No recommendations message
    await t.expect(memoryEfficiencyPage.noRecommendationsMessage.textContent).eql(noRecommendationsMessage, 'No recommendations message not displayed');
});
test
    .before(async t => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneConfig, ossStandaloneConfig.databaseName);
        keyName = `recomKey-${common.generateWord(10)}`;
        await browserPage.addStringKey(stringKeyName, '2147476121', 'field');
        await t.click(myRedisDatabasePage.myRedisDBButton);
        await addRedisDatabasePage.addLogicalRedisDatabase(ossStandaloneConfig, index);
        await myRedisDatabasePage.clickOnDBByName(`${ossStandaloneConfig.databaseName} [${index}]`);
        await browserPage.addHashKey(keyName, '2147476121', 'field', 'value');
    })
    .after(async t => {
        // Clear and delete database
        await t.click(myRedisDatabasePage.browserButton);
        await browserPage.deleteKeyByName(keyName);
        await deleteCustomDatabase(`${ossStandaloneConfig.databaseName} [${index}]`);
        await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
        await browserPage.deleteKeyByName(stringKeyName);
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    })('Avoid using logical databases recommendation', async t => {
        // Go to Analysis Tools page
        await t.click(myRedisDatabasePage.analysisPageButton);
        await t.click(memoryEfficiencyPage.newReportBtn);
        // Go to Recommendations tab
        await t.click(memoryEfficiencyPage.recommendationsTab);
        // Verify that user can see Avoid using logical databases recommendation when the database supports logical databases and there are keys in more than 1 logical database
        await t.expect(memoryEfficiencyPage.avoidLogicalDbAccordion.exists).ok('Avoid using logical databases recommendation not displayed');
        await t.expect(memoryEfficiencyPage.codeChangesLabel.exists).ok('Avoid using logical databases recommendation not have Code Changes label');
    });
test
    .before(async t => {
        await acceptLicenseTermsAndAddDatabaseApi(ossStandaloneConfig, ossStandaloneConfig.databaseName);
        // Go to Analysis Tools page and create new report and open recommendations
        await t.click(myRedisDatabasePage.analysisPageButton);
        await t.click(memoryEfficiencyPage.newReportBtn);
        await t.click(memoryEfficiencyPage.recommendationsTab);
    }).after(async() => {
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    })('Verify that user can upvote recommendations', async t => {
        await memoryEfficiencyActions.voteForVeryUsefulAndVerifyDisabled();
        // Verify that user can see previous votes when reload the page
        await common.reloadPage();
        await t.click(memoryEfficiencyPage.recommendationsTab);
        await memoryEfficiencyActions.verifyVoteDisabled();

        await t.click(memoryEfficiencyPage.newReportBtn);
        await memoryEfficiencyActions.voteForUsefulAndVerifyDisabled();

        await t.click(memoryEfficiencyPage.newReportBtn);
        await memoryEfficiencyActions.voteForNotUsefulAndVerifyDisabled();
        // Verify that user can see the popup with link when he votes for “Not useful”
        await t.expect(memoryEfficiencyPage.recommendationsFeedbackBtn.visible).ok('popup did not appear after voting for not useful');
    });