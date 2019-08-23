const QueueMessageStatus = require("./queue-message-status");

class QueueMessage {
    constructor() {
        this.date = new Date();
        this.message = null;
        this.deliverTo = null;
        this.status = QueueMessageStatus.None;
        this.errorDate = null;
        this.relationship = null;
    }

    get needsAck() {
        return !this.relationship.noAck;
    }

    get isPending() {
        return this.status === QueueMessageStatus.None;
    }

    get isWaitingACK() {
        return this.status === QueueMessageStatus.WaitingACK;
    }

    get isFinished() {
        return this.status === QueueMessageStatus.Finished;
    }

    get isError() {
        this.errorDate = new Date();
        return this.status === QueueMessageStatus.Error;
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
        this.status = QueueMessageStatus.Sent;
    }

    waitingAck() {
        this.status = QueueMessageStatus.WaitingACK;
    }

    finish() {
        this.status = QueueMessageStatus.Finished;
    }

    setError() {
        this.status = QueueMessageStatus.Error;
    }
}

module.exports = QueueMessage;