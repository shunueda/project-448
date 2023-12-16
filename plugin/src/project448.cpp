#include "project448.h"
#include "vdj/vdjPlugin8.h"
#include "util.h"
#include <thread>
#include "project448.h"
#include "util.h"
#include "vdj/vdjPlugin8.h"
#include <utility>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <iostream>

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef server::message_ptr message_ptr;

HRESULT VDJ_API Project448::OnGetPluginInfo(TVdjPluginInfo8 *infos) {
    infos->PluginName = "Project448";
    infos->Author = "Shun Ueda";
    infos->Description = "Part of Project448";
    infos->Version = "1.0";
    infos->Flags = 0x00;
    infos->Bitmap = nullptr;
    return S_OK;
}

HRESULT VDJ_API Project448::OnLoad() {
    return S_OK;
}

ULONG VDJ_API Project448::Release() {
    delete this;
    return 0;
}

HRESULT VDJ_API Project448::OnStart() {
    start_server();
    return S_OK;
}

HRESULT VDJ_API Project448::OnStop() {
    socket_server.stop_listening();
    return S_OK;
}

void Project448::start_server() {
    std::thread thread([this]() {
        socket_server.set_access_channels(websocketpp::log::alevel::all);
        socket_server.clear_access_channels(websocketpp::log::alevel::frame_payload);
        socket_server.init_asio();
        socket_server.set_message_handler(
                bind([this](server *s, websocketpp::connection_hdl hdl, server::message_ptr msg) {
                    auto payload = msg->get_payload();
                    post("Sending: " + payload);
                    char buffer[2048];
                    this->GetStringInfo(payload.c_str(), buffer, 2048);
                    s->send(std::move(hdl), std::string(buffer), msg->get_opcode());
                }, &socket_server, ::_1, ::_2));
        socket_server.listen(9002);
        socket_server.start_accept();
        socket_server.run();
    });
    thread.detach();
}