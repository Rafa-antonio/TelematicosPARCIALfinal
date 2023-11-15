Vagrant.configure("2") do |config|

  if Vagrant.has_plugin? "vagrant-vbguest"
    config.vbguest.no_install  = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote   = true
  end


  config.vm.define :servidor2 do |servidor2|
    servidor2.vm.box = "bento/ubuntu-22.04"
    servidor2.vm.network :private_network, ip: "192.168.50.2"
    servidor2.vm.hostname = "servidor2"
    servidor2.vm.synced_folder ".", "/vagrant"
  end

  config.vm.define :servidor1 do |servidor1|
    servidor1.vm.box = "bento/ubuntu-22.04"
    servidor1.vm.network :private_network, ip: "172.16.0.3"
    servidor1.vm.network :private_network, ip: "192.168.50.3"
    servidor1.vm.hostname = "servidor1"
    servidor1.vm.synced_folder ".", "/vagrant"
  end

end