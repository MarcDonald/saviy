import Foundation
import SafariServices.SFSafariApplication

private enum Constant {
	static let openSettings = "openSettings"
	static let resetSettings = "resetSettings"
}

class ExtensionConfigViewModel: ObservableObject {
	@Published var config: Config = DefaultConfig

	// TODO: store in config as actual numbers
	@Published var scrollSize: String = ""
	@Published var scrollDuration: String = ""

	func dispatchOpenSettings() {
		SFSafariApplication.dispatchMessage(
			withName: Constant.openSettings,
			toExtensionWithIdentifier: Constants.extensionIdentifier,
			userInfo: nil) { (error) in
			if let error = error {
				print(error.localizedDescription)
			}
		}
	}

	func dispatchResetSettings() {
		SFSafariApplication.dispatchMessage(
			withName: Constant.resetSettings,
			toExtensionWithIdentifier: Constants.extensionIdentifier,
			userInfo: nil) { (error) in
			if let error = error {
				print(error.localizedDescription)
			}
		}
	}
}
