//
//  AppDelegate.swift
//  BoringYouTubeSafari
//
//  Created by Boring YouTube Extension
//

import Cocoa
import SafariServices

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Check if Safari extension is enabled
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: "com.boringyoutube.safari.extension") { (state, error) in
            DispatchQueue.main.async {
                if let error = error {
                    print("Error getting extension state: \(error.localizedDescription)")
                    return
                }
                
                if let state = state {
                    print("Extension enabled: \(state.isEnabled)")
                    
                    // Post notification to update UI
                    NotificationCenter.default.post(name: Notification.Name("ExtensionStateChanged"), object: state.isEnabled)
                }
            }
        }
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }
}
