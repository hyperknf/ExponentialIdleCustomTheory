export class Item {
    /**
     * Line data of the item
     * @type {{
     *  line: number,
     *  end: number
     * }}
    */
    line

    /**
     * Children of the item
     * @type {Record<string, Item>}
     */
    children

    /**
     * Creates a new Item
     * @param {number} start - Starting line
     * @param {number} end - Ending line
     * @param {Record<string, Item> | undefined} children - Children
     */
    constructor(start, end, children) {
        this.line = { start, end }
        this.children = children ?? {}
    }

    /**
     * Adds a new child
     * @param {string} name - Name
     * @param {Item} item - Item
     * @returns {Item} This item
     */
    addChild(name, item) {
        this.children = Object.assign({},
            this.children,
            { [name]: item }
        )
        return this
    }
}

export class Theory extends Item {
    /**
     * Name of the theory
     * @type {string}
     */
    name

    /**
     * Creates a new Theory
     * @param {string} name 
     * @param {any} authors
     * @param {any} version
     * @param {number} version_code
     * @param {number} start 
     * @param {number} end 
     * @param {Record<string, Item> | undefined} children 
     */
    constructor(name, authors, version, version_code, start, end, children) {
        super(start, end, children)
        this.name = name
        this.authors = authors
        this.version = version
        this.version_code = version_code
    }
}

export var Version = ""

export var ExponentialPower = new Theory("Exponential Power", "HyperKNF", "1.3.3d", 1, 1, 1650, {
    imports: new Item(1, 6),
    info: new Item(8, 36),
    text_resource: new Item(42, 320),
    theory_info: new Item(322, 366),
    data: new Item(368, 477, {
        drho: new Item(372, 374),
        theory_placeholders: new Item(376, 382),
        dt: new Item(384, 386),
        achievements_placeholders: new Item(390, 410),
        page: new Item(412, 414),
        e: new Item(416, 420),
        t: new Item(422, 424),
        domain: new Item(426, 428),
        rho: new Item(430, 434),
        b: new Item(436, 438),
        time: new Item(440, 445),
        developer_settings: new Item(447, 452),
        settings: new Item(454, 469),
        display: new Item(471, 477)
    }),
    utilities: new Item(479, 534),
    initialize: new Item(536, 958, {
        currency_creation: new Item(541, 544),
        regular_upgrades: new Item(546, 690, {
            k: new Item(548, 554),
            c1: new Item(556, 564),
            c2: new Item(566, 573),
            x1: new Item(575, 581),
            x2: new Item(583, 589),
            y1: new Item(591, 598),
            y2: new Item(600, 607),
            n: new Item(609, 615),
            a: new Item(617, 624),
            b: new Item(626, 632),
            x: new Item(634, 640),
            y: new Item(642, 649),
            l1: new Item(651, 658),
            l2: new Item(660, 667),
            p: new Item(669, 675),
            dt: new Item(677, 690)
        }),
        permanent_upgrades: new Item(692, 795, {
            default_upgrades: new Item(694, 697),
            unlock_e: new Item(699, 724),
            unlock_second_currency: new Item(726, 734),
            max_drho_display: new Item(736, 750),
            time_display: new Item(752, 766),
            lock_settings: new Item(768, 782),
            show_statistics: new Item(784, 795)
        }),
        singular_upgrades: new Item(797, 817, {
            domain_switch: new Item(799, 808),
            test_upgrade: new Item(811, 816)
        }),
        milestone_upgrades: new Item(819, 874, {
            settings: new Item(821, 822),
            unlock: new Item(824, 842),
            unlock_2: new Item(844, 850),
            unlock_e_max_level: new Item(852, 858),
            time_exponent: new Item(860, 866),
            c1_exponent: new Item(868, 874)
        }),
        achievements: new Item(876, 952)
    }),
    sdk_functions: new Item(960, 978),
    tick_updates: new Item(980, 1132, {
        update_page: new Item(984, 989),
        update_max_level: new Item(993, 1003, {
            unlock_e_i: new Item(994, 1002)
        }),
        update_availability: new Item(1005, 1038, {
            regular_upgrades: new Item(1008, 1028),
            permanent_upgrades: new Item(1030, 1033),
            singular_upgrades: new Item(1035, 1037)
        }),
        main_function: new Item(1042, 1032, {
            time: new Item(1043, 1047),
            dt: new Item(1049, 1053),
            e_i: new Item(1055, 1068),
            t_and_currencies: new Item(1070, 1088),
            max_rho_update: new Item(1090, 1093),
            achievements: new Item(1095, 1110),
            statistics_debug: new Item(1112, 1118),
            equation_invalidation: new Item(1120, 1125),
            calling_update_functions: new Item(1127, 1131)
        })
    }),
    currency_visible: new Item(1134, 1147),
    equation_displays: new Item(1149, 1298),
    tau: new Item(1300, 1317),
    variables: new Item(1319, 1382),
    e_i_functions: new Item(1384, 1473),
    equation_overlays: new Item(1475, 1520),
    internal_states: new Item(1522, 1564),
    pages_and_stages: new Item(1566, 1587),
    class_definitions: new Item(1589, 1646),
    calling_initialize: new Item(1648, 1650)
})

export var CurveOfTime = new Item(1, 473)

module.exports = {
    Version,
    ExponentialPower,
    CurveOfTime
}