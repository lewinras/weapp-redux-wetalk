export const RECEIVE_SYSTEM_INFOS = 'RECEIVE_SYSTEM_INFOS';

export function initSystemInfo(res) {
    return {type: RECEIVE_SYSTEM_INFOS, result: res}
}