//
//  SafariExtensionHandler.swift
//  BoringYouTubeSafari Extension
//
//  Created by Boring YouTube Extension
//

import SafariServices
import os.log

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    // Extension state - default to enabled
    private var extensionEnabled: Bool = true
    
    override init() {
        super.init()
        // Load saved state
        loadExtensionState()
    }
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // Handle messages from content script
        os_log(.default, "Received message: %@", messageName)
        
        switch messageName {
        case "getState":
            // Send current extension state to content script
            page.dispatchMessageToScript(withName: "extensionState", userInfo: ["enabled": extensionEnabled])
            
        case "toggleExtension":
            // Toggle extension state (could be triggered by toolbar button)
            extensionEnabled.toggle()
            saveExtensionState()
            
            // Notify all active YouTube tabs
            SFSafariApplication.getAllWindows { windows in
                for window in windows {
                    window.getAllTabs { tabs in
                        for tab in tabs {
                            tab.getActivePage { page in
                                page?.dispatchMessageToScript(withName: "toggleExtension", userInfo: ["enabled": self.extensionEnabled])
                            }
                        }
                    }
                }
            }
            
        default:
            break
        }
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // Handle toolbar button click - toggle extension
        extensionEnabled.toggle()
        saveExtensionState()
        
        os_log(.default, "Extension toggled to: %@", extensionEnabled ? "enabled" : "disabled")
        
        // Notify all YouTube tabs in this window
        window.getAllTabs { tabs in
            for tab in tabs {
                tab.getActivePage { page in
                    page?.dispatchMessageToScript(withName: "toggleExtension", userInfo: ["enabled": self.extensionEnabled])
                }
            }
        }
        
        // Update toolbar item appearance
        updateToolbarItem()
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // Always enable the toolbar item, but change label based on state
        let label = extensionEnabled ? "Disable Boring YouTube" : "Enable Boring YouTube"
        validationHandler(true, label)
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }
    
    // MARK: - State Management
    
    private func loadExtensionState() {
        extensionEnabled = UserDefaults.standard.object(forKey: "BoringYouTubeEnabled") as? Bool ?? true
    }
    
    private func saveExtensionState() {
        UserDefaults.standard.set(extensionEnabled, forKey: "BoringYouTubeEnabled")
    }
    
    private func updateToolbarItem() {
        SFSafariApplication.getAllWindows { windows in
            for window in windows {
                // Force toolbar validation update
                window.getToolbarItem { toolbarItem in
                    // The validation handler will be called automatically
                }
            }
        }
    }
}
