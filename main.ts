function GitHub () {
    modem.comment("calliope-net/modem-41")
    modem.comment("2 Erweiterungen laden:")
    modem.comment("calliope-net/modem; calliope-net/pins")
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    modem.comment("blau: Text senden")
    send_text = "Modem"
    if (led_an) {
        led_an = false
        pins.pinDigitalWrite(modem.get_settings(modem.e_settings.pin_led), led_an)
        basic.pause(2000)
    }
    ft_messen = false
    anzeige_aktualisieren()
    basic.setLedColor(0x0000ff)
    pins.oled_clear(2, 4)
    pins.oled_write_text(2, 0, 15, pins.pins_text("Senden Start"))
    pins.oled_write_text(3, 0, 15, send_text)
    for (let Index = 0; Index <= send_text.length - 1; Index++) {
        modem.comment("jedes Zeichen erst anzeigen, dann senden")
        pins.oled_write_text(4, 0, 15, send_text.substr(0, Index + 1))
        modem.sende_code(modem.charCodeAt(send_text.charAt(Index)))
    }
    modem.comment("ENTER (CR) anhängen")
    modem.sende_code(13)
    pins.oled_write_text(2, 0, 15, "Senden Ende " + send_text.length)
    basic.setLedColor(0x00ff00)
})
function empfangen () {
    empf_text = ""
    while (!(empf_break)) {
        empf_asc = modem.empfange_1zeichen()
        if (empf_asc == 13) {
            break;
        } else if (modem.between(empf_asc, 32, 127)) {
            empf_text = "" + empf_text + String.fromCharCode(empf_asc)
        } else {
            empf_text = "" + empf_text + empf_asc
        }
        pins.oled_write_text(6, 0, 15, empf_text)
    }
    return empf_text
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    modem.empfang_abbrechen()
    empf_break = true
})
function anzeige_aktualisieren () {
    pins.oled_write_text(0, 0, 15, "hell<" + modem.get_settings(modem.e_settings.helligkeit) + "<dunkel")
    pins.oled_write_text(1, 0, 6, "FT " + pins.pinAnalogRead(modem.get_settings(modem.e_settings.pin_fototransistor)))
    if (ft_messen) {
        pins.oled_write_text(1, 7, 15, pins.pins_text("dauerhaft"))
    } else {
        pins.oled_write_text(1, 7, 15, "Takt " + modem.get_settings(modem.e_settings.takt_ms))
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    modem.comment("rot: Text empfangen")
    ft_messen = false
    anzeige_aktualisieren()
    basic.setLedColor(0xff0000)
    empf_break = false
    pins.oled_clear(5, 7)
    pins.oled_write_text(5, 0, 15, pins.pins_text("Empfang Start"))
    e_text = empfangen()
    pins.oled_write_text(7, 0, 15, e_text)
    pins.oled_write_text(5, 0, 15, "Empfang Ende " + e_text.length)
    basic.setLedColor(0x00ff00)
})
input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
    modem.comment("LED dauerhaft an/aus schalten")
    led_an = !(led_an)
    pins.pinDigitalWrite(modem.get_settings(modem.e_settings.pin_led), led_an)
    pins.oled_clear(2, 4)
    pins.oled_write_text(3, 0, 15, "Senden LED " + led_an)
})
input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
    ft_messen = !(ft_messen)
    anzeige_aktualisieren()
})
let e_text = ""
let empf_asc = 0
let empf_break = false
let empf_text = ""
let ft_messen = false
let led_an = false
let send_text = ""
if (!(pins.simulator())) {
    modem.set_pins(DigitalPin.C17, AnalogPin.C16, 15)
    modem.set_takt(50, 0.5, 1)
    modem.comment("weiß zu hell; grün OK")
    if (modem.empfange1bit()) {
        basic.setLedColor(0xffffff)
    } else {
        basic.setLedColor(0x00ff00)
    }
    pins.oled_reset(pins.oled_pages.y64, false, true)
    anzeige_aktualisieren()
}
basic.forever(function () {
    if (ft_messen) {
        pins.oled_write_text(1, 0, 6, "FT " + pins.pinAnalogRead(modem.get_settings(modem.e_settings.pin_fototransistor)))
        basic.pause(500)
    }
})
