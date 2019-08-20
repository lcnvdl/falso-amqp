class QueueMessage {
    constructor() {
        this.date = new Date();
        this.message = null;
        this.deliverTo = null;
        this.status = 0;
        this.errorDate = null;
        this.relationship = null;
    }

    get isPending() {
        return this.status === 0;
    }

    get isFinished() {
        return this.status === 2;
    }

    get isError() {
        this.errorDate = new Date();
        return this.status === 3;
    }

    get timeAfterError() {
        return this.errorDate ? (new Date().getTime() - this.errorDate.getTime()) : -1;
    }

    get isInFinishedStatus() {
        return this.isFinished || this.isError;
    }

    get shouldBeDestroyed() {
        return this.isFinished || (this.isError && !this.canRetry);
    }

    get canRetry() {
        return this.message.retries < this.message.maxRetries;
    }

    send() {
        this.status = 1;
    }

    finish() {
        this.status = 2;
    }

    setError() {
        this.status = 3;
    }
}

module.exports = QueueMessage;