/**
 * Add key binds to JUMP, allowing the user to navigate
 * through tags and sites using their keyboards. When the
 * user presses "T", the tag dropdown is opened and the
 * arrow keys can be used to cycle through the tags. When
 * the tag list is closed, the sites will be navigated
 * with the arrow keys instead. Pressing ENTER will open
 * the selected tag or site, pressing ESCAPE will deselect
 * both active tag and site. The user can also open a site
 * by pressing CTRL + number. When a site is found at the
 * pressed number, it will be opened. Numbers start at 1
 * and end at 0 (ten).
 */
export default class KeyBinds {
    constructor() {
        this.keys = new Map();
        this.numericKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    }

    /**
     * Initialise the key binds by adding event listeners.
     */
    init() {
        document.addEventListener("keydown", (e) => {
            this.keys.set(e.key, true);
            this.process();
        });

        document.addEventListener("keyup", (e) => {
            this.keys.set(e.key, false);
        })
    }

    /**
     * Determine whether to directly open a site or navigate the tags or sites.
     */
    process() {
        if (this.keys.get("Control")) {
            this.activate_site();
        } else {
            this.parse_navigation();
        }
    }

    /**
     * Activate the site for the number that was pressed on the keyboard.
     */
    activate_site() {
        // Determine the number that was pressed.
        const site = this.numericKeys.find((n) => this.keys.get(n) === true);

        if (site) {
            // Convert 0 to 10, so ten shortcuts can be offered with 1 being the first.
            const num = site === "0" ? "10" : site;

            // Find the site for the number. When none is found, the result will be null.
            const anchor = document.querySelector(`ul.sites li:nth-child(${num}) a`);

            // Trigger the anchor of the site, if any.
            if (anchor) {
                anchor.click();
            }
        }
    }

    /**
     * Parse the active key to determine how to navigate.
     */
    parse_navigation() {
        // The T key is bound to opening and closing the tags list.
        if (this.keys.get("t")) {
            document.getElementById("tags").classList.toggle("enable");
            return;
        }

        // The arrow keys will cycle through tags or sites.
        if (this.keys.get("ArrowUp") || this.keys.get("ArrowDown") || this.keys.get("ArrowLeft") || this.keys.get("ArrowRight")) {
            // Determine whether tags or sites should be cycled through.
            if (document.getElementById("tags").classList.contains("enable")) {
                this.navigate_elements('#tags', this.keys.get("ArrowDown") || this.keys.get("ArrowRight"));
            } else {
                this.navigate_elements('ul.sites', this.keys.get("ArrowDown") || this.keys.get("ArrowRight"));
            }
            return;
        }

        // The ENTER key will activate a selected tag or site.
        if (this.keys.get("Enter")) {
            // Determine whether tags or sites should be triggered.
            if (document.getElementById("tags").classList.contains("enable")) {
                document.querySelector("#tags a.active").click();
            } else {
                document.querySelector("ul.sites a.active").click();
            }
            return;
        }
    
        // The ESCAPE key will deselect any active tag or site.
        if (this.keys.get('Escape')) {
            document.querySelectorAll('a.active').forEach(a => a.classList.remove('active'));
        }
    }

    /**
     * Navigate through tags or sites.
     * @param containerSelector {string} The CSS selector for the container in which the anchors can be found.
     * @param forward {boolean} Whether we are cycling forward through the list of anchors or not.
     */
    navigate_elements(containerSelector, forward) {
        let newEl;

        // Find the currently active anchor. When found, the next link will be determined, otherwise
        // the first or last, based on the value of "forward", will be selected.
        const activeEl = document.querySelector(`${containerSelector} a.active`);

        if (activeEl) {
            activeEl.classList.toggle("active");
            newEl = (forward ? activeEl.parentElement.nextElementSibling : activeEl.parentElement.previousElementSibling)?.querySelector("a");
        } else {
            newEl = document.querySelector(`${containerSelector} li:${forward ? 'first' : 'last'}-of-type a`);
        }

        newEl?.classList.toggle("active");
    }
}