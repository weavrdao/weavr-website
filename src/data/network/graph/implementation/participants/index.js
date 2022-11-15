class Partcipant {
	constructor(address, type) {
		this.address = address,
		this.type = type
	}
}

export function mapParticipants(rawParticipants) {
	return rawParticipants.map(({
		address,
		type
	}) => new Partcipant(address, type))
}