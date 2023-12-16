#include "project448.h"


HRESULT VDJ_API DllGetClassObject(const GUID &rclsid, const GUID &riid, void **ppObject) {
    if (memcmp(&rclsid, &CLSID_VdjPlugin8, sizeof(GUID)) == 0 &&
        memcmp(&riid, &IID_IVdjPluginDsp8, sizeof(GUID)) == 0) {
        *ppObject = new Project448();
    } else {
        return CLASS_E_CLASSNOTAVAILABLE;
    }

    return NO_ERROR;
}
