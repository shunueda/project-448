#include "project448.h"
#include "vdj/vdjPlugin8.h"
#include "util.h"
#include <thread>
#include "project448.h"
#include "util.h"
#include "vdj/vdjPlugin8.h"

#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/server.hpp>

#include <iostream>

typedef websocketpp::server <websocketpp::config::asio> server;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

// pull out the type of messages sent by our config
typedef server::message_ptr message_ptr;

void on_message(server *s, websocketpp::connection_hdl hdl, message_ptr msg) {
    std::cout << "on_message called with hdl: " << hdl.lock().get()
              << " and message: " << msg->get_payload()
              << std::endl;

    // check for a special command to instruct the server to stop listening so
    // it can be cleanly exited.
    if (msg->get_payload() == "stop-listening") {
        s->stop_listening();
        return;
    }

    try {
        s->send(hdl, msg->get_payload(), msg->get_opcode());
    } catch (websocketpp::exception const &e) {
        std::cout << "Echo failed because: "
                  << "(" << e.what() << ")" << std::endl;
    }
}

HRESULT VDJ_API Project448::OnGetPluginInfo(TVdjPluginInfo8 *infos) {
    infos->PluginName = "Project448";
    infos->Author = "Shun Ueda";
    infos->Description = "Part of Project448";
    infos->Version = "1.0";
    infos->Flags = 0x00;
    infos->Bitmap = nullptr;
    return S_OK;
}

//-----------------------------------------------------------------------------
HRESULT VDJ_API Project448::OnLoad() {
    return S_OK;
}

//---------------------------------------------------------------------------
ULONG VDJ_API Project448::Release() {
    delete this;
    return 0;
}

//---------------------------------------------------------------------------
HRESULT VDJ_API Project448::OnStart() {
    post("Start");
    startServer();
    return S_OK;
}

//---------------------------------------------------------------------------
HRESULT VDJ_API Project448::OnStop() {
    // ADD YOUR CODE HERE WHEN THE AUDIO PLUGIN IS STOPPED

    return S_OK;
}

HRESULT VDJ_API Project448::OnProcessSamples(float *buffer, int nb) {
    return S_OK;
}

void Project448::startServer() {
    std::thread thread([this]() {  // Capture `this` to access class member `echo_server`
        post("1");
        try {
            // Set logging settings
            socket_server.set_access_channels(websocketpp::log::alevel::all);
            post("2");
            socket_server.clear_access_channels(websocketpp::log::alevel::frame_payload);
            post("3");

            // Initialize ASIO
            socket_server.init_asio();
            post("4");

            // Register our message handler
            socket_server.set_message_handler(bind(&on_message, &socket_server, ::_1, ::_2));
            post("5");

            // Listen on port 9002
            socket_server.listen(9002);
            post("Listening on port 9002");

            // Start the server accept loop
            socket_server.start_accept();
            post("6");

            // Start the ASIO io_service run loop
            socket_server.run();
            post("7");
        } catch (websocketpp::exception const &e) {
            std::cout << "WebSocket exception: " << e.what() << std::endl;
            post("WebSocket exception occurred");
        } catch (std::exception const &e) {
            post(e.what());
            post("Standard exception occurred");
        } catch (...) {
            std::cout << "Unknown exception" << std::endl;
            post("Unknown exception occurred");
        }
    });
    thread.detach();
}