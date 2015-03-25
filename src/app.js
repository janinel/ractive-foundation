RactiveF = {
	components: {},
	templates: {},
	widgets: [],
	initInstance: function (container) {

		// Have we mixed in extensions to all instances yet?
		if (!Ractive.prototype.findAllChildComponents) {

			// FIXME: Is there any other way to do it? Without using lodash dependency.
			_.mixin(Ractive.prototype, {
				/*
				 * When working with nested components we only want to find child
				 * components, not all decendants.
				 * @param name
				 */
				findAllChildComponents: function (name) {
					return _.filter(this.findAllComponents(name), function (component) {
						return this._guid === component.parent._guid;
					}.bind(this));
				},

				/**
				 * If we have a "datamodel" property, that should override any other data.
				 * This is now a "data-driven" component.
				 * isDataModel is a flag for hbs logic, on whether to use datamodel data or call {{yield}}.
				 * @see http://docs.ractivejs.org/latest/ractive-reset
				 */
				onconfig: function () {
					var data = this.get();
					if (data.datamodel) {
						data.datamodel.isDataModel = true;
						this.reset(data.datamodel);
					}
				}

			});

		}

		return new Ractive({
			el: container,
			template: Ractive.parse(container.innerHTML),
			components: RactiveF.components,
			onrender: function () {
				this.el.classList.remove('hide');
				this.el.classList.add('initialize');
			}
		});
	}
};

if (typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', function () {
		var containers = document.querySelectorAll('.ractivef');
		for (var i = 0; i < containers.length; i++) {
			var instance = RactiveF.initInstance(containers[i]);
			RactiveF.widgets.push(instance);
		}
	});
}