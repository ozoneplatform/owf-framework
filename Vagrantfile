# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

$script = <<SCRIPT

yum install -y gcc python-devel python-setuptools libselinux-python git
easy_install pip
pip install paramiko PyYAML jinja2 boto ansible --upgrade

mkdir -p /etc/ansible/
cat > /etc/ansible/hosts << EOM
[localhost]
127.0.0.1 ansible_user=vagrant
EOM

ansible-pull -d /home/vagrant/ozone-build-pull -U https://github.com/rob-szew/ozoneops.git ansible/playbooks-pull/ozone_build_box.yml

cat > /home/vagrant/.bashrc << EOM
if [ -f /etc/bashrc ]; then
  . /etc/bashrc
fi

curl -s get.gvmtool.net | bash
source "/home/vagrant/.gvm/bin/gvm-init.sh"
gvm install grails 2.3.7

export ANT_HOME="/opt/apache-ant-1.9.2"
export MAVEN_HOME="/opt/apache-maven-3.1.1"
export JAVA_HOME="/usr/lib/jvm/java"
export GROOVY_HOME="/opt/groovy-1.8.9"
export PATH="\\$JAVA_HOME/bin:\\$GRAILS_HOME/bin:\\$ANT_HOME/bin:\\$MAVEN_HOME/bin:\\$GROOVY_HOME/bin:\\$PATH"
EOM

SCRIPT

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "chef/centos-6.5"

  config.vm.network :forwarded_port, guest: 8080, host: 6080
  config.vm.network :forwarded_port, guest: 8443, host: 6443
  config.vm.network :forwarded_port, guest: 5005, host: 6005

  config.vm.provider "vmware_fusion" do |v|
    v.gui = false
    
    v.vmx["memsize"] = "2048"
    v.vmx["numvcpus"] = "2"
  end

  config.vm.provider :virtualbox do |vb|
    vb.gui = false
  
    vb.customize ["modifyvm", :id, "--memory", "2048"]
    vb.customize ["modifyvm", :id, "--cpus", "2"]
  end

  config.vm.provision "shell", inline: $script

end
