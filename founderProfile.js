// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class FounderProfile {
    constructor(name, fffraise, startupStage, revenue, picture) {
        this.name = name;
        this.fffraise = fffraise;
        this.startupStage = startupStage;
        this.revenue = revenue;
        //below is a placeholder for attachments
        this.picture = picture;
    }
}

module.exports.FounderProfile = FounderProfile;
