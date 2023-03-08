export class Asset {
    constructor(id, state, governor, descriptor ) {
        this.id = id;
        this.state = state;
        this.governor = governor;
        this.descriptor = descriptor;
    }
}

export class Needle extends Asset {
    constructor(id, state, governor, descriptor, amountDeposited, target, deposits, withdrawals, distribuitions, tradeToken) {
        super(id, state, governor, descriptor);
        this.amountDeposited = amountDeposited;
        this.target = target;
        this.deposits = deposits;
        this.withdrawals = withdrawals;
        this.distribuitions = distribuitions;
        this.tradeToken = tradeToken;
    }
}

export class Thread extends Asset {
    constructor(id, state, governor, descriptor, variant, erc20) {
        super(id, state, governor, descriptor);
        this.variant = variant;
        this.erc20 = erc20;
    }
}
