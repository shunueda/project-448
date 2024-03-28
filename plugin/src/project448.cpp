#include "project448.h"
#include "vdj/vdjPlugin8.h"
#include <thread>
#include <utility>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::lib::bind;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;

HRESULT VDJ_API Project448::OnGetPluginInfo(TVdjPluginInfo8 *infos) {
  infos->PluginName = "project-448";
  infos->Author = "Shun Ueda <me@shu.nu>";
  infos->Description = "Plugin for project-448";
  infos->Version = "1.0";
  infos->Flags = 0x00;
  infos->Bitmap = nullptr;
  return S_OK;
}

HRESULT VDJ_API Project448::OnLoad() { return S_OK; }

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

std::string Project448::run_script(const std::string &script) {
  auto buffer_size = 2048;
  char buffer[buffer_size];
  this->GetStringInfo(script.c_str(), buffer, buffer_size);
  std::string result(buffer);
  return result;
}

void Project448::start_server() {
    std::thread thread([this]() {
        socket_server.set_access_channels(websocketpp::log::alevel::all);
        socket_server.clear_access_channels(websocketpp::log::alevel::frame_payload);
        socket_server.init_asio();
        socket_server.set_message_handler(
                bind([this](server *s, websocketpp::connection_hdl hdl, const server::message_ptr &msg) {
                    std::string result = msg->get_payload();
                    if (msg->get_payload() == "get_state") {
                        std::string crossfader = run_script("crossfader");
                        std::string left_filepath = run_script("deck 1 get_filepath");
                        std::string right_filepath = run_script("deck 2 get_filepath");
                        std::string left_position = run_script("deck 1 get_time 'elapsed' 'absolute'");
                        std::string right_position = run_script("deck 2 get_time 'elapsed' 'absolute'");
                        result = "{"
                                 "  \"leftDeck\": {"
                                 "    \"filepath\": \"" + left_filepath + "\","
                                                                          "    \"position\": " +
                                 std::to_string(time_to_ms(left_position))
                                 + "  },"
                                   "  \"rightDeck\": {"
                                   "    \"filepath\": \"" + right_filepath + "\","
                                                                             "    \"position\": " +
                                 std::to_string(time_to_ms(right_position))
                                 + "  },"
                                   "  \"crossfader\": " + crossfader
                                 + "}";
                    }
                    s->send(std::move(hdl), result, msg->get_opcode());
                }, &socket_server, ::_1, ::_2));
        socket_server.listen(8000);
        socket_server.start_accept();
        socket_server.run();
    });
    thread.detach();
}

int Project448::time_to_ms(const std::string &timestr) {
  if (timestr.empty()) {
    return 0;
  }
  int minutes, seconds;
  double fractionalSeconds;
  char colon, dot;
  std::istringstream iss(timestr);
  iss >> minutes >> colon >> seconds >> dot >> fractionalSeconds;
  if (colon != ':' || dot != '.' || iss.fail()) {
    std::cerr << "Invalid time format" << std::endl;
    return -1;
  }
  int fractionalPartLength = timestr.substr(timestr.find('.') + 1).length();
  int milliseconds =
      static_cast<int>(fractionalSeconds * pow(10, 3 - fractionalPartLength));
  return (minutes * 60 + seconds) * 1000 + milliseconds;
}