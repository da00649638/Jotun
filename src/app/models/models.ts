// tslint:disable-next-line:class-name
export class userDetails {
    id: number;
    UserName: string;
    // tslint:disable-next-line:variable-name
    emailId: any;
    // tslint:disable-next-line:variable-name
    roleInfo: string;
    // tslint:disable-next-line:variable-name
    userGroup: string;
    // tslint:disable-next-line:variable-name
    active_status: boolean;
    country: string;
    // tslint:disable-next-line:variable-name
    accessLevel: any;

    productLevels: any;

}

// tslint:disable-next-line:class-name
export class userGroup {
    id: number;
    // tslint:disable-next-line:variable-name
    usergroup_name: string;
    country: any;
    // tslint:disable-next-line:variable-name
    access_level: string;
    // tslint:disable-next-line:variable-name
    active_status: boolean;
    productlevels: any;
}

// tslint:disable-next-line:class-name
export class country {
    id: number;
    name: string;
}

// tslint:disable-next-line:class-name
export class search {
    name: any;
    email: any;
    role: any;
    // tslint:disable-next-line:variable-name
    access_levels: any;
    status: boolean;
    country: string;
    usergroup: string;
}

// tslint:disable-next-line:class-name
export class changestatus {
    id: number;
    // tslint:disable-next-line:variable-name
    active_status: boolean;
}

// tslint:disable-next-line:class-name
export class basicRawForm {
    selectGroup: string;
    rmID: number;
    nameRawMaterial: string;
    alphaGroup: string;
    manufacture: any;
    technicalCoordinator: string;
    specialGravity: number;
    durability: string;
}

// tslint:disable-next-line:class-name
export class rawAttributes {
    density: number;
    equivalentWeight: number;
    acidValue: number;
    hydroxylValue: number;
    oilAbsorption: number;
    epoxyEquivalentWeight: number;
    carboxylEquivalentWeight: number;
    aminoHydrogenEquivalentWeight: number;
    polyesterWeight: number;
    hydroxylEquivalentWeight: number;
    ncoEquivalentWeight: number;
    unsaturatedEquivalentWeight: number;
    casNumber: string;
    components: string;
}

// tslint:disable-next-line:class-name
export class newGroup {
    // tslint:disable-next-line:variable-name
    group_name: string;
    // tslint:disable-next-line:variable-name
    type_of_name: string;
}

// tslint:disable-next-line:class-name
// export class pigmentationForm {
//     colourGroup: {
//         name: string,
//         id: number
//     };
//     colourID: string;
//     colorName: string;
//     pigmentGroup: any =    {
//         groupID: '',
//         groupName: ''
//     };
//     pvc: {
//         min: number,
//         max: number
//     };
//     filter: {
//         min: number,
//         max: number
//     };
//     filterTio: {
//         min: number,
//         max: number
//     };
//     amount: any;
//     durability: string;
// }

// tslint:disable-next-line:class-name
export class pigmentationForm {
    colourGroupId: number;
    colourGroupName: string;
    colourId: number;
    colorName: string;
    colourCode: string;
    pigmentGroup: any =    {
        groupID: '',
        groupName: ''
    };
    pvcMin: number;
    pvcMax: number;
    fillerMin: number;
    fillerMax: number;
    fillerToMin: number;
    fillerToMax: number;
    amount: any;
    durabilityId: any;
}

// tslint:disable-next-line:class-name
export class newColourGroup {
    groupName: string;
}
