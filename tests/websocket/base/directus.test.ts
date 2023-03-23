/**
 * @jest-environment node
 */

import { WebSocketAuth, DirectusWebSocket, WebSocketItemsHandler, WebSocketTransport } from '../../../src/websocket';

describe('sdk', function () {
	const sdk = new DirectusWebSocket('http://example.com');

	it('has auth', function () {
		expect(sdk.auth).toBeInstanceOf(WebSocketAuth);
	});

	it('has transport', function () {
		expect(sdk.transport).toBeInstanceOf(WebSocketTransport);
	});

	// it('has activity instance', function () {
	// 	expect(sdk.activity).toBeInstanceOf(ActivityHandler);
	// });

	// it('has activity instance', function () {
	// 	expect(sdk.activity.comments).toBeInstanceOf(CommentsHandler);
	// });

	// it('has collections instance', function () {
	// 	expect(sdk.collections).toBeInstanceOf(CollectionsHandler);
	// });

	// it('has fields instance', function () {
	// 	expect(sdk.fields).toBeInstanceOf(FieldsHandler);
	// });

	// it('has files instance', function () {
	// 	expect(sdk.files).toBeInstanceOf(FilesHandler);
	// });

	// it('has folders instance', function () {
	// 	expect(sdk.folders).toBeInstanceOf(FoldersHandler);
	// });

	// it('has permissions instance', function () {
	// 	expect(sdk.permissions).toBeInstanceOf(PermissionsHandler);
	// });

	// it('has presets instance', function () {
	// 	expect(sdk.presets).toBeInstanceOf(PresetsHandler);
	// });

	// it('has relations instance', function () {
	// 	expect(sdk.relations).toBeInstanceOf(RelationsHandler);
	// });

	// it('has revisions instance', function () {
	// 	expect(sdk.revisions).toBeInstanceOf(RevisionsHandler);
	// });

	// it('has roles instance', function () {
	// 	expect(sdk.roles).toBeInstanceOf(RolesHandler);
	// });

	// it('has server instance', function () {
	// 	expect(sdk.server).toBeInstanceOf(ServerHandler);
	// });

	// it('has settings instance', function () {
	// 	expect(sdk.settings).toBeInstanceOf(SettingsHandler);
	// });

	// it('has users instance', function () {
	// 	expect(sdk.users).toBeInstanceOf(UsersHandler);
	// });

	// it('has users invites', function () {
	// 	expect(sdk.users.invites).toBeInstanceOf(InvitesHandler);
	// });

	// it('has user profile', function () {
	// 	expect(sdk.users.me).toBeInstanceOf(MeHandler);
	// });

	// it('has users tfa', function () {
	// 	expect(sdk.users.me.tfa).toBeInstanceOf(TFAHandler);
	// });

	// it('has utils instance', function () {
	// 	expect(sdk.utils).toBeInstanceOf(UtilsHandler);
	// });

	it('has items', async function () {
		expect(sdk.items('collection')).toBeInstanceOf(WebSocketItemsHandler);
	});
});
