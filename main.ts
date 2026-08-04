function GitHub () {
    modem.comment("calliope-net/modem-41")
    modem.comment("2 Erweiterungen laden:")
    modem.comment("calliope-net/modem; calliope-net/pins")
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (led_an) {
        pins.pinDigitalWrite(pins.pins_eDigitalPins(pins.eDigitalPins.C17), false)
        basic.pause(2000)
    }
    modem.comment("blau: Text 'Modem' senden")
    basic.setLedColor(0x0000ff)
    stext = "Modem"
    pins.oled_write_text(3, 0, 15, stext)
    for (let Index = 0; Index <= stext.length - 1; Index++) {
        modem.comment("jedes Zeichen erst anzeigen, dann senden")
        pins.oled_write_text(4, 0, 15, stext.substr(0, Index + 1))
        modem.sende_code(modem.charCodeAt(stext.charAt(Index)))
    }
    modem.comment("am Ende ENTER anhängen")
    modem.sende_code(13)
    modem.comment("am Ende LED wieder aus schalten")
    basic.turnRgbLedOff()
})
function empfangen () {
    etext = ""
    while (!(ebreak)) {
        easc = modem.empfange_1zeichen()
        if (easc == 13) {
            break;
        } else if (modem.between(easc, 32, 127)) {
            etext = "" + etext + String.fromCharCode(easc)
        } else {
            etext = "" + etext + "|" + easc + "|"
        }
        pins.oled_write_text(6, 0, 15, etext)
    }
    return etext
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    modem.empfang_abbrechen()
    ebreak = true
    basic.showString(etext)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    ft_messen = false
    modem.comment("rot: Text empfangen")
    basic.setLedColor(0xff0080)
    ebreak = false
    pins.oled_write_text(7, 0, 15, empfangen())
    modem.comment("am Ende LED wieder aus schalten")
    basic.turnRgbLedOff()
})
input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
    led_an = !(led_an)
    pins.pinDigitalWrite(pins.pins_eDigitalPins(pins.eDigitalPins.C17), led_an)
})
input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
    ft_messen = !(ft_messen)
})
let ft_messen = false
let easc = 0
let ebreak = false
let etext = ""
let stext = ""
let led_an = false
let helligkeit = 0
let takt = 0
if (!(pins.simulator())) {
    takt = 400
    helligkeit = 50
    modem.set_pins(DigitalPin.C17, AnalogPin.C16, helligkeit)
    modem.set_takt(takt, 0.5, 1)
    modem.comment("weiß wenn hell (Fehler); grün wenn dunkel (OK)")
    if (modem.empfange1bit()) {
        basic.setLedColor(0xffffff)
    } else {
        basic.setLedColor(0x00ff00)
    }
    pins.oled_reset(pins.oled_pages.y64, false, true)
    pins.oled_write_text(0, 0, 15, "hell<" + helligkeit + "<dunkel")
    modem.comment("zeigt analogen Wert vom Fototransistor")
    pins.oled_write_text(1, 0, 7, "FT " + pins.analogReadPin(AnalogPin.C16))
    pins.oled_write_text(1, 8, 15, "Takt " + takt)
}
basic.forever(function () {
    if (ft_messen) {
        pins.oled_write_text(1, 0, 7, "FT " + pins.analogReadPin(AnalogPin.C16))
        basic.pause(500)
    }
})
