const config = require('../../src/config')

// user 5 will used to update pwd
const users = {
  size: 100,
  data:
  {
    admin:
    {
      uid: 'admin',
      nick: 'admin',
      privilege: config.privilege.Root,
      pwd: config.deploy.adminInitPwd,
    },
    toelevate:
    {
      uid: 'toelevate',
      pwd: 'toelevate',
    },
    primaryuser:
    {
      uid: 'primaryuser',
      nick: 'user',
      pwd: 'testtest',
    },
    banned: { uid: 'banned', pwd: ')zD1d_mh)7', privilege: config.privilege.Banned },
    kevin63: { uid: 'kevin63', pwd: '^I^+6XYfGV' },
    ugordon: { uid: 'ugordon', nick: 'UGORDON', pwd: 'BwcTvXC%&8' },
    hallpatrick: { uid: 'hallpatrick', nick: 'HALLPATRICK', pwd: '(7#gZxV)5+' },
    westrhonda: { uid: 'westrhonda', nick: 'WESTRHONDA', pwd: 'i+9r&9IyCA' },
    muellerkevin: { uid: 'muellerkevin', nick: 'MUELLERKEVIN', pwd: 'b+C2g4Khd4' },
    jasongonzales: { uid: 'jasongonzales', nick: 'JASONGONZALES', pwd: 'Lz7FTU9h%0' },
    sarah51: { uid: 'sarah51', nick: 'SARAH51', pwd: '#U7FwLPj*p' },
    david56: { uid: 'david56', nick: 'DAVID56', pwd: 'rJ6HUHQe)8' },
    robertchambers: { uid: 'robertchambers', nick: 'ROBERTCHAMBERS', pwd: 'nr8XGBOg+9' },
    sandyreese: { uid: 'sandyreese', nick: 'SANDYREESE', pwd: '9CMsEnRd^3' },
    louissharp: { uid: 'louissharp', nick: 'LOUISSHARP', pwd: 'lX90EqjX%C' },
    anthonychapman: { uid: 'anthonychapman', nick: 'ANTHONYCHAPMAN', pwd: '*rY7XyeN_*' },
    hamiltonjoseph: { uid: 'hamiltonjoseph', pwd: 'K$h3&WTdl2' },
    tammyhart: { uid: 'tammyhart', pwd: ')mcCPlZi)0' },
    nataliebarrett: { uid: 'nataliebarrett', nick: 'NATALIEBARRETT', pwd: '@kQQu3HpE_' },
    nicholssamantha: { uid: 'nicholssamantha', nick: 'NICHOLSSAMANTHA', pwd: 'GuR7XfvgG_' },
    zacharydonovan: { uid: 'zacharydonovan', nick: 'ZACHARYDONOVAN', pwd: 'E$4VLCpe7L' },
    alvaradojeffrey: { uid: 'alvaradojeffrey', nick: 'ALVARADOJEFFREY', pwd: '#@e$4PrFgu' },
    jasonfuller: { uid: 'jasonfuller', nick: 'JASONFULLER', pwd: 'LWV+4Djs2K' },
    alexandrajennings: { uid: 'alexandrajennings', nick: 'ALEXANDRAJENNINGS', pwd: 'dsD8AcEo$u' },
    grahamautumn: { uid: 'grahamautumn', nick: 'GRAHAMAUTUMN', pwd: 'S31^bpLf&5' },
    jamiejohnson: { uid: 'jamiejohnson', pwd: 'no4U!HAl#1' },
    gescobar: { uid: 'gescobar', nick: 'GESCOBAR', pwd: '+TTB1ei09$' },
    rebeccadonovan: { uid: 'rebeccadonovan', pwd: '$tn_0SPfa6' },
    sanchezcharles: { uid: 'sanchezcharles', nick: 'SANCHEZCHARLES', pwd: 'Hh2DTu43R^' },
    parkerjohn: { uid: 'parkerjohn', nick: 'PARKERJOHN', pwd: 'TFX$X8TgTf' },
    carolyn23: { uid: 'carolyn23', pwd: 'J*J7FFklBB' },
    nicolehess: { uid: 'nicolehess', nick: 'NICOLEHESS', pwd: ')46SQwst2Y' },
    aharmon: { uid: 'aharmon', nick: 'AHARMON', pwd: 'd!6JFur3^b' },
    richardssharon: { uid: 'richardssharon', nick: 'RICHARDSSHARON', pwd: 'P3k93X_d!(' },
    anthonywilliams: { uid: 'anthonywilliams', nick: 'ANTHONYWILLIAMS', pwd: '%8xQ9ueqRB' },
    wilcoxsusan: { uid: 'wilcoxsusan', pwd: 'K+7n23RmkZ' },
    sean81: { uid: 'sean81', nick: 'SEAN81', pwd: 'nFvwl9Rv2^' },
    sedwards: { uid: 'sedwards', nick: 'SEDWARDS', pwd: 'E3dp1YyE$0' },
    paula17: { uid: 'paula17', nick: 'PAULA17', pwd: 'Zw5$8aLyY_' },
    kingaustin: { uid: 'kingaustin', pwd: 'xisW63SlN*' },
    christopherholder: { uid: 'christopherholder', nick: 'CHRISTOPHERHOLDER', pwd: '6oCdYyEu%U' },
    sherri77: { uid: 'sherri77', nick: 'SHERRI77', pwd: 'PB1Ta$$gN$' },
    andrewmendoza: { uid: 'andrewmendoza', nick: 'ANDREWMENDOZA', pwd: '8V8NrSin#!' },
    lisacarter: { uid: 'lisacarter', nick: 'LISACARTER', pwd: '0#4Nld+zFs' },
    chandlerjames: { uid: 'chandlerjames', pwd: '$6TWGIPe7x' },
    kevin05: { uid: 'kevin05', nick: 'KEVIN05', pwd: '4T^YkdLl!z' },
    kimberly65: { uid: 'kimberly65', nick: 'KIMBERLY65', pwd: '@bR_CofRk8' },
    torreskimberly: { uid: 'torreskimberly', nick: 'TORRESKIMBERLY', pwd: '^rRHKC+jJ5' },
    martinkimberly: { uid: 'martinkimberly', nick: 'MARTINKIMBERLY', pwd: 'T(8i90AyOA' },
    samuelnicholson: { uid: 'samuelnicholson', nick: 'SAMUELNICHOLSON', pwd: 'w32K1pyef_' },
    kennedyjennifer: { uid: 'kennedyjennifer', pwd: '*2GViGWqf(' },
    nicole71: { uid: 'nicole71', nick: 'NICOLE71', pwd: '(eUfqLj289' },
    johnsonhenry: { uid: 'johnsonhenry', nick: 'JOHNSONHENRY', pwd: '&7Lz8iMP20' },
    grobinson: { uid: 'grobinson', nick: 'GROBINSON', pwd: '^Q2MjEJhW&' },
    christinaprice: { uid: 'christinaprice', nick: 'CHRISTINAPRICE', pwd: '#7X^N0FvM2' },
    jonathanjackson: { uid: 'jonathanjackson', nick: 'JONATHANJACKSON', pwd: '^j5wAU%w0j' },
    csanchez: { uid: 'csanchez', nick: 'CSANCHEZ', pwd: 'fN%v10Rgs@' },
    edward70: { uid: 'edward70', nick: 'EDWARD70', pwd: 'i+g3J8wtad' },
    mark63: { uid: 'mark63', nick: 'MARK63', pwd: 'u)T7U3GcX2' },
    cohenarthur: { uid: 'cohenarthur', nick: 'COHENARTHUR', pwd: 'k_)5TvBhgF' },
    esantos: { uid: 'esantos', nick: 'ESANTOS', pwd: 'h6TxGdw$+p' },
    michael12: { uid: 'michael12', nick: 'MICHAEL12', pwd: 'as#BzGUK(5' },
    makaylaalexander: { uid: 'makaylaalexander', nick: 'MAKAYLAALEXANDER', pwd: '!$x4YwUGlE' },
    michaeldavis: { uid: 'michaeldavis', pwd: 'Pp60DegAv!' },
    castroscott: { uid: 'castroscott', nick: 'CASTROSCOTT', pwd: '+s8BwFmTHX' },
    christopher15: { uid: 'christopher15', nick: 'CHRISTOPHER15', pwd: '&5veZ6cv&U' },
    stephanie06: { uid: 'stephanie06', pwd: 'v1JlFrOb@8' },
    billy27: { uid: 'billy27', nick: 'BILLY27', pwd: 'zY9&PvYi^l' },
    jonathanmorales: { uid: 'jonathanmorales', nick: 'JONATHANMORALES', pwd: 'VL)m5LVvgK' },
    fmcclain: { uid: 'fmcclain', nick: 'FMCCLAIN', pwd: 'hd+6FooR0h' },
    stephaniegarner: { uid: 'stephaniegarner', pwd: 'y44GaEgo%%' },
    sotosarah: { uid: 'sotosarah', nick: 'SOTOSARAH', pwd: 'oO&l3P2eR#' },
    vdavis: { uid: 'vdavis', nick: 'VDAVIS', pwd: 'NjyBg1Cdq+' },
    margaretbutler: { uid: 'margaretbutler', pwd: ')B8KQ4dpM#' },
    colton76: { uid: 'colton76', pwd: '3k6QRCri+V' },
    rachelchen: { uid: 'rachelchen', nick: 'RACHELCHEN', pwd: 'J7!LQ!Wl@(' },
    pfitzpatrick: { uid: 'pfitzpatrick', pwd: '3QG#2(QofU' },
    fduffy: { uid: 'fduffy', nick: 'FDUFFY', pwd: ')EVV9QlG!*' },
    christopher26: { uid: 'christopher26', nick: 'CHRISTOPHER26', pwd: 'X^9VH$Ys!I' },
    nuneztaylor: { uid: 'nuneztaylor', nick: 'NUNEZTAYLOR', pwd: '8@8)F!nuU&' },
    imay: { uid: 'imay', nick: 'IMAY', pwd: 'l3JJHj*o)d' },
    courtneywarren: { uid: 'courtneywarren', nick: 'COURTNEYWARREN', pwd: '7Bf9U@&k*5' },
    sara52: { uid: 'sara52', nick: 'SARA52', pwd: 'D6TSz$uu@b' },
    agriffin: { uid: 'agriffin', pwd: '7GU4s*2kV_' },
    melissa57: { uid: 'melissa57', pwd: '@SoWXVfM7E' },
    michaelwillis: { uid: 'michaelwillis', nick: 'MICHAELWILLIS', pwd: '7%xZUxLl*k' },
    howellchristopher: { uid: 'howellchristopher', nick: 'HOWELLCHRISTOPHER', pwd: 'wd#4#3Ign#' },
    brandon34: { uid: 'brandon34', nick: 'BRANDON34', pwd: '_Da49UCjH*' },
    robertallen: { uid: 'robertallen', pwd: '1)d3nB3j_t' },
    michelle03: { uid: 'michelle03', pwd: 'a*%21Bj)Nw' },
    wellszachary: { uid: 'wellszachary', nick: 'WELLSZACHARY', pwd: 'o0j7RpSf*+' },
    dale12: { uid: 'dale12', nick: 'DALE12', pwd: '!@d5MP*yhS' },
    williamsshelby: { uid: 'williamsshelby', pwd: 'U!#^4TRbP_' },
    bryanmalone: { uid: 'bryanmalone', pwd: '20dV3prk!D' },
    matthew48: { uid: 'matthew48', nick: 'MATTHEW48', pwd: 'N_+55Gwz7S' },
    greeredward: { uid: 'greeredward', pwd: 'eUp^3UVbX6' },
    daniel17: { uid: 'daniel17', nick: 'DANIEL17', pwd: '(Y5SXq2s%^' },
    brandon73: { uid: 'brandon73', nick: 'BRANDON73', pwd: '#4qV43p#x6' },
    ewingbrian: { uid: 'ewingbrian', pwd: 'mqqL@qqd^8' },
    jean91: { uid: 'jean91', pwd: 'd)0HYm+dw6' },
  },
}

module.exports = users
