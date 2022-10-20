import { createCustomElement } from '@servicenow/ui-core'; //Required Now Experiecne UI Framework custom component logic
import snabbdom from '@servicenow/ui-renderer-snabbdom'; //Virtual DOM library used to render a component
import '@servicenow/now-button';
import styles from './styles.scss'; //File containing Sass (Syntactically Awesome Style Sheet) styling for a component

const view = (state, { updateState }) => {
	const { peopleCount } = state;
	const { recordInsert } = state;
	const { message } = state;
	const { showModal } = state;


	return (
		<body>
			<div>
				<div>
					<div class="title">
						<h1>People Counter</h1>
						<h4>This is a component that counts people. Press +1 to add one or press -1 to remove another. Clear the count by clicking on the clear button.</h4>
					</div>
					<div>
						<h2>{peopleCount}</h2>
					</div>
					<div class="buttons">
						<span>
							<now-button label="+1"
										variant="primary-positive"
										size="lg" icon=""
										config-aria={{}}
										tooltip-content="Add one person to the count"
										append-to-payload={{ id: 'add' }}
							/* 	on-click commented because it collided with the NOW_BUTTON#CLICKED action
								on-click={
								() => updateState({ peopleCount: (peopleCount + 1), recordInsert: "Person added successfully :)", message: "" })} */
							></now-button>
						</span>
						<span>
							<now-button label="-1"
										variant="secondary-positive"
										size="lg"
										icon=""
										config-aria={{}}
										tooltip-content="Subtract one person to the count"
										append-to-payload={{ id: 'subtract' }}
								/* on-click={
								// () => updateState({ peopleCount: (peopleCount - 1), recordInsert: "Person removed successfully :(" }) --> old
								() => {
									if (peopleCount <= 0)
										updateState({ peopleCount: 0, message: "People count cannot be negative" })


									else {
										updateState({ peopleCount: (peopleCount - 1), recordInsert: "Person removed successfully :(", message: "" })}}} */
							></now-button>
						</span>
						<span>
							<now-button label="Clear"
										variant="secondary-tertiary"
										size="lg"
										icon=""
										config-aria={{}}
										tooltip-content="Clear the count"
										append-to-payload={{ id: 'clear' }}
							// on-click={() => updateState({ peopleCount: 0, recordInsert: "List cleared", message: "" })}></now-button>
							></now-button>
						</span>
						<div>
							<h3>{recordInsert}</h3>
						</div>						
							<now-modal	opened={showModal}
										size="sm"
										header-label="Modal header"
										content="This is modal text content."
										footer-actions={[{ "label": "Clear", "variant": "primary-negative", "payload": {'id': 'trulyClear'} },
														{ "label": "Cancel", "variant": "secondary", "payload": {'id': 'cancel'} }]}></now-modal>
					</div>
				</div>
			</div>
		</body >
	);
};

createCustomElement('x-919852-people-counter', {
	renderer: { type: snabbdom },
	view,
	styles,
	initialState: {
		peopleCount: 0,
		recordInsert: "",
		showModal: false
	},
	actionHandlers: {

		'NOW_BUTTON#CLICKED': (coeffects) => {

			let idCall = coeffects.action.payload.id; //Takes the id info declared among the attributes from the coeffects
			let peopleCountCall = coeffects.state.peopleCount; //Expresses the value of peopleCount when the user clicks the button; if absent, I wouldn't know the value of peopleCount, because it's declared in another "node" and this is a separate function

			if (idCall == "add") {
				coeffects.updateState({ peopleCount: (peopleCountCall + 1), recordInsert: "Person added successfully :)" });
			}
			else if (idCall == "subtract") {
				if (peopleCountCall <= 0) {
					coeffects.updateState({ peopleCount: 0, recordInsert: "People count cannot be negative" });
				}

				else {
					coeffects.updateState({ peopleCount: (peopleCountCall - 1), recordInsert: "Person removed successfully :(" });
				}
			}
			else if (idCall == "clear") {
				coeffects.updateState({ showModal: true });
			}
		},
		'NOW_MODAL#FOOTER_ACTION_CLICKED': (coeffects) => {

			let idCall = coeffects.action.payload.footerAction.payload.id; //NB: when in doubt, follow the path displayed on the console of the browser debug tool

			if (idCall == "trulyClear") {
				coeffects.updateState({ peopleCount: 0, recordInsert: "List cleared", showModal: false });
			}
			else if (idCall == "cancel") {
				coeffects.updateState({ showModal: false });
			}
		},
		'NOW_MODAL#OPENED_SET': (coeffects) => {
			coeffects.updateState({ showModal: false });
		}

	}
});
