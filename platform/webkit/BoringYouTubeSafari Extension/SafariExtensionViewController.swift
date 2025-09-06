//
//  SafariExtensionViewController.swift
//  BoringYouTubeSafari Extension
//
//  Created by Boring YouTube Extension
//

import SafariServices
import Cocoa

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width: 280, height: 200)
        return shared
    }()
    
    @IBOutlet weak var toggleButton: NSButton!
    @IBOutlet weak var statusLabel: NSTextField!
    @IBOutlet weak var statusIndicator: NSView!
    @IBOutlet weak var descriptionLabel: NSTextField!
    
    private var extensionEnabled: Bool = true {
        didSet {
            updateUI()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        loadExtensionState()
        updateUI()
    }
    
    private func setupUI() {
        // Setup the toggle button
        toggleButton.title = "Toggle Extension"
        toggleButton.target = self
        toggleButton.action = #selector(toggleButtonClicked(_:))
        
        // Setup labels
        descriptionLabel.stringValue = "Make YouTube thumbnails grayscale"
        descriptionLabel.textColor = NSColor.secondaryLabelColor
        descriptionLabel.font = NSFont.systemFont(ofSize: 12)
        
        // Setup status indicator
        statusIndicator.wantsLayer = true
        statusIndicator.layer?.cornerRadius = 4
    }
    
    private func loadExtensionState() {
        extensionEnabled = UserDefaults.standard.object(forKey: "BoringYouTubeEnabled") as? Bool ?? true
    }
    
    private func saveExtensionState() {
        UserDefaults.standard.set(extensionEnabled, forKey: "BoringYouTubeEnabled")
    }
    
    private func updateUI() {
        DispatchQueue.main.async {
            if self.extensionEnabled {
                self.toggleButton.title = "Disable"
                self.statusLabel.stringValue = "Extension is active"
                self.statusIndicator.layer?.backgroundColor = NSColor.systemGreen.cgColor
            } else {
                self.toggleButton.title = "Enable"
                self.statusLabel.stringValue = "Extension is disabled"
                self.statusIndicator.layer?.backgroundColor = NSColor.systemRed.cgColor
            }
        }
    }
    
    @objc private func toggleButtonClicked(_ sender: NSButton) {
        extensionEnabled.toggle()
        saveExtensionState()
        
        // Notify all YouTube tabs
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
        
        updateUI()
    }
}

// MARK: - Programmatic UI Creation (if no XIB/Storyboard)
extension SafariExtensionViewController {
    
    override func loadView() {
        // Create the main view
        let view = NSView(frame: NSRect(x: 0, y: 0, width: 280, height: 200))
        
        // Create and configure the toggle button
        toggleButton = NSButton(frame: NSRect(x: 20, y: 140, width: 240, height: 30))
        toggleButton.bezelStyle = .rounded
        toggleButton.title = "Toggle Extension"
        
        // Create and configure the status label
        statusLabel = NSTextField(frame: NSRect(x: 50, y: 100, width: 180, height: 20))
        statusLabel.isEditable = false
        statusLabel.isBordered = false
        statusLabel.backgroundColor = NSColor.clear
        statusLabel.font = NSFont.systemFont(ofSize: 14, weight: .medium)
        
        // Create and configure the status indicator
        statusIndicator = NSView(frame: NSRect(x: 20, y: 105, width: 10, height: 10))
        
        // Create and configure the description label
        descriptionLabel = NSTextField(frame: NSRect(x: 20, y: 60, width: 240, height: 30))
        descriptionLabel.isEditable = false
        descriptionLabel.isBordered = false
        descriptionLabel.backgroundColor = NSColor.clear
        descriptionLabel.font = NSFont.systemFont(ofSize: 12)
        descriptionLabel.textColor = NSColor.secondaryLabelColor
        descriptionLabel.stringValue = "Make YouTube thumbnails grayscale to reduce visual distractions"
        descriptionLabel.lineBreakMode = .byWordWrapping
        descriptionLabel.usesSingleLineMode = false
        descriptionLabel.cell?.wraps = true
        
        // Create version label
        let versionLabel = NSTextField(frame: NSRect(x: 20, y: 20, width: 240, height: 20))
        versionLabel.isEditable = false
        versionLabel.isBordered = false
        versionLabel.backgroundColor = NSColor.clear
        versionLabel.font = NSFont.systemFont(ofSize: 10)
        versionLabel.textColor = NSColor.tertiaryLabelColor
        versionLabel.stringValue = "Boring YouTube v1.0.0"
        versionLabel.alignment = .center
        
        // Add subviews
        view.addSubview(toggleButton)
        view.addSubview(statusLabel)
        view.addSubview(statusIndicator)
        view.addSubview(descriptionLabel)
        view.addSubview(versionLabel)
        
        self.view = view
    }
}
