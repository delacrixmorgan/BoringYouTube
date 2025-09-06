//
//  ViewController.swift
//  BoringYouTubeSafari
//
//  Created by Boring YouTube Extension
//

import Cocoa
import SafariServices

class ViewController: NSViewController {
    
    @IBOutlet weak var appNameLabel: NSTextField!
    @IBOutlet weak var extensionStatusLabel: NSTextField!
    @IBOutlet weak var instructionsLabel: NSTextField!
    @IBOutlet weak var openSafariButton: NSButton!
    @IBOutlet weak var extensionStatusIndicator: NSView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        checkExtensionState()
        
        // Listen for extension state changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(extensionStateChanged(_:)),
            name: Notification.Name("ExtensionStateChanged"),
            object: nil
        )
    }
    
    override func viewDidAppear() {
        super.viewDidAppear()
        checkExtensionState()
    }
    
    private func setupUI() {
        appNameLabel.stringValue = "Boring YouTube for Safari"
        appNameLabel.font = NSFont.boldSystemFont(ofSize: 18)
        
        instructionsLabel.stringValue = "To enable the extension:\n\n1. Open Safari Preferences\n2. Go to Extensions tab\n3. Enable 'Boring YouTube Extension'\n4. Visit YouTube to see grayscale thumbnails"
        instructionsLabel.font = NSFont.systemFont(ofSize: 12)
        
        openSafariButton.title = "Open Safari Preferences"
        openSafariButton.target = self
        openSafariButton.action = #selector(openSafariPreferences(_:))
        
        extensionStatusIndicator.wantsLayer = true
        extensionStatusIndicator.layer?.cornerRadius = 5
    }
    
    private func checkExtensionState() {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: "com.boringyoutube.safari.extension") { (state, error) in
            DispatchQueue.main.async {
                if let error = error {
                    self.updateExtensionStatus(enabled: false, error: error.localizedDescription)
                    return
                }
                
                let isEnabled = state?.isEnabled ?? false
                self.updateExtensionStatus(enabled: isEnabled)
            }
        }
    }
    
    private func updateExtensionStatus(enabled: Bool, error: String? = nil) {
        if let error = error {
            extensionStatusLabel.stringValue = "Error: \(error)"
            extensionStatusLabel.textColor = NSColor.systemRed
            extensionStatusIndicator.layer?.backgroundColor = NSColor.systemRed.cgColor
        } else if enabled {
            extensionStatusLabel.stringValue = "Extension is enabled in Safari"
            extensionStatusLabel.textColor = NSColor.systemGreen
            extensionStatusIndicator.layer?.backgroundColor = NSColor.systemGreen.cgColor
        } else {
            extensionStatusLabel.stringValue = "Extension is not enabled in Safari"
            extensionStatusLabel.textColor = NSColor.systemOrange
            extensionStatusIndicator.layer?.backgroundColor = NSColor.systemOrange.cgColor
        }
    }
    
    @objc private func openSafariPreferences(_ sender: NSButton) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.boringyoutube.safari.extension") { error in
            if let error = error {
                DispatchQueue.main.async {
                    let alert = NSAlert()
                    alert.messageText = "Could not open Safari Preferences"
                    alert.informativeText = error.localizedDescription
                    alert.addButton(withTitle: "OK")
                    alert.runModal()
                }
            }
        }
    }
    
    @objc private func extensionStateChanged(_ notification: Notification) {
        if let enabled = notification.object as? Bool {
            updateExtensionStatus(enabled: enabled)
        }
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Programmatic UI Creation (if no Storyboard)
extension ViewController {
    
    override func loadView() {
        // Create the main view
        let view = NSView(frame: NSRect(x: 0, y: 0, width: 400, height: 300))
        
        // App name label
        appNameLabel = NSTextField(frame: NSRect(x: 20, y: 250, width: 360, height: 30))
        appNameLabel.isEditable = false
        appNameLabel.isBordered = false
        appNameLabel.backgroundColor = NSColor.clear
        appNameLabel.font = NSFont.boldSystemFont(ofSize: 18)
        appNameLabel.alignment = .center
        
        // Status indicator
        extensionStatusIndicator = NSView(frame: NSRect(x: 20, y: 210, width: 12, height: 12))
        
        // Status label
        extensionStatusLabel = NSTextField(frame: NSRect(x: 40, y: 205, width: 340, height: 20))
        extensionStatusLabel.isEditable = false
        extensionStatusLabel.isBordered = false
        extensionStatusLabel.backgroundColor = NSColor.clear
        extensionStatusLabel.font = NSFont.systemFont(ofSize: 14, weight: .medium)
        
        // Instructions label
        instructionsLabel = NSTextField(frame: NSRect(x: 20, y: 80, width: 360, height: 120))
        instructionsLabel.isEditable = false
        instructionsLabel.isBordered = false
        instructionsLabel.backgroundColor = NSColor.clear
        instructionsLabel.font = NSFont.systemFont(ofSize: 12)
        instructionsLabel.textColor = NSColor.secondaryLabelColor
        instructionsLabel.lineBreakMode = .byWordWrapping
        instructionsLabel.usesSingleLineMode = false
        instructionsLabel.cell?.wraps = true
        
        // Open Safari button
        openSafariButton = NSButton(frame: NSRect(x: 120, y: 30, width: 160, height: 30))
        openSafariButton.bezelStyle = .rounded
        
        // Add subviews
        view.addSubview(appNameLabel)
        view.addSubview(extensionStatusIndicator)
        view.addSubview(extensionStatusLabel)
        view.addSubview(instructionsLabel)
        view.addSubview(openSafariButton)
        
        self.view = view
    }
}
