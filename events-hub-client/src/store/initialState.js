const initialState = {
	account: JSON.parse(localStorage.getItem('account'))
};

console.log(initialState.account);

export default initialState;