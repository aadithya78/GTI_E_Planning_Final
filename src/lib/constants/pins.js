const PINS = Object.freeze({
    BIN: Object.freeze({
        A: 160,
        B: 161,
        C: 162,
        D: 163,
        E: 164,
        F: 165,
        G: 166,
        H: 167,
    }),

    CON: Object.freeze({
        1: 129,
        2: 130,
        3: 131,
        4: 132,
        5: 133,
        6: 134,
        7: 135,
        8: 136,
        9: 137,
        10: 138,
        11: 139,
        12: 140,
        13: 141,
        14: 142,
        15: 143,
        16: 144,
    }),
});

const commands = Object.freeze({
    BIN: 70,
    CON: 75,
});

module.exports = {
    PINS,
    commands,
};
