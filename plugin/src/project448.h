#ifndef PROJECT448_H
#define PROJECT448_H

#include <vdj/vdjDsp8.h>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;

class Project448 : public IVdjPluginDsp8 {
public:
    HRESULT VDJ_API OnLoad() override;

    HRESULT VDJ_API OnGetPluginInfo(TVdjPluginInfo8 *infos) override;

    ULONG VDJ_API Release() override;

    HRESULT VDJ_API OnStart() override;

    HRESULT VDJ_API OnStop() override;

    HRESULT VDJ_API OnProcessSamples(float *buffer, int nb) override {
        return S_OK;
    };

    server socket_server;

    void start_server();
};

#endif