function GitHub () {
    modem.comment("calliope-net/modem-41")
    modem.comment("1 Erweiterung: calliope-net/modem")
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    modem.comment("blau: Text 'Modem' senden")
    basic.setLedColor(0x0000ff)
    text = "Modem"
    for (let zeichen of text) {
        modem.comment("jedes Zeichen erst anzeigen, dann senden")
        basic.showString(zeichen)
        modem.sende_code(modem.charCodeAt(zeichen))
    }
    modem.comment("am Ende ENTER anhängen")
    modem.sende_code(13)
    modem.comment("am Ende LED wieder aus schalten")
    basic.turnRgbLedOff()
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    modem.empfang_abbrechen()
    basic.showString(text)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    modem.comment("rot: Text empfangen")
    basic.setLedColor(0xff0000)
    basic.clearScreen()
    text = modem.empfange_text_bis13()
    basic.showString(text)
    modem.comment("am Ende LED wieder aus schalten")
    basic.turnRgbLedOff()
})
let text = ""
modem.set_pins(DigitalPin.C17, AnalogPin.C16)
modem.comment("zeigt analogen Wert vom Fototransistor")
basic.showNumber(pins.analogReadPin(AnalogPin.C16))
modem.comment("weiß wenn hell (Fehler); grün wenn dunkel (OK)")
if (modem.empfange1bit()) {
    basic.setLedColor(0xffffff)
} else {
    basic.setLedColor(0x00ff00)
}
