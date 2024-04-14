interface UniboardData {
    uniboardData : {
        id: string,
        creator: string,
        persistedOnServer: boolean,
        type: string,
        data?: string,
        fileName?: string
    }
}

export function hasUniboardData(obj: any) : obj is UniboardData {
    return 'uniboardData' in obj;
}

export default UniboardData;